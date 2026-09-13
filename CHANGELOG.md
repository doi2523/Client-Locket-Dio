# Changelog

All notable changes to the Locket Dio Android client (apps/expo) are documented in this file.

## [Unreleased] — feat/android-locketdio

### Added (round 5)
- **Locket Calendar (streak screen)**: new `components/calendar/LocketCalendarView.tsx` + `streakUtils.ts` — swipe-away streak calendar day cards with `StreakIcon` (web ActionStreak parity), month grid, and streak statistics. The left pager page (`(tabs)/index.tsx`) now shows the calendar instead of the profile, with a "Locket Calendar" glass title in the header (`headerhome` `isCalendar` mode).
- **Standalone profile route** (`app/profile.tsx`): full profile page (header avatar → `router.push("/profile")`), with web-parity **subscription card** (plan name / days remaining) and **upload stats card** (`image_uploaded` / `video_uploaded` / `total_storage_used_mb` via extended `UserPlan.upload_stats`), powered by new `getLocketsCount` (`moment.services.ts`).
- **Camera studio upgrade** (`CameraScreen`):
  - **Audience selector** below the action row: Riêng tư (lock) / selected-friends avatars / công khai — maps to `friendUids` on `uploadMedia` (private = self only).
  - **CustomizeStudioModal** (`components/ui/CustomizeStudioModal.tsx`): overlay/caption editor fed by new `overlay.services.ts` (`fetchOverlaySections`), with emoji pairs, gradient backgrounds, music, location and poll sections (new `poll_icon`, `color_palette_icon` assets).
  - **Spotify caption**: URL modal → `getInfoMusicByUrl` (`music.services.ts`, `/api/getInfoMusicV2`) appends "🎵 title - artist" to the caption.
  - **Location tag**: `location.services.ts` (`getCurrentLocationVariants`, expo-location) with Vietnamese admin-unit name normalization.
  - **Dynamic palette from media**: `src/utils/mediaPalette.ts` extracts dominant color + palette via `expo-image-manipulator` + `jpeg-js` (new dep) for caption gradient backgrounds.
  - **LocketCaptionOverlay** (`components/ui/LocketCaptionOverlay.tsx`): in-preview editable caption pill with blur material + gradient background, replacing the plain caption `TextInput`.
  - Send button redesigned (M3E upload-square SVG, `colors.primary` circle); success feedback via Android `Toast`; double-upload guarded (`uploading` flag).
- **Chat enhancements** (`app/chat/[uid].tsx`): pure-emoji messages render oversized without a bubble; reaction toggle (tap same emoji = remove) via new `removeReactionOnMessage` service + `messages.store.toggleReaction` (applies across all loaded conversations); full emoji picker modal from the input row; keyboard-aware auto-scroll; `formatShortTimeAgo` ("vừa xong", "5m", "2h", "3d", "1w") timestamps.
- **Feature gating** (`src/hooks/useFeature.ts`): `useFeatureVisible` / `useGetCustomerCode` read `feature_blocks` / `features` from the user plan (web parity); applied in FriendsModal alongside the new friend-slot limit control.
- **Bottom bar hide flag**: `appSlice.setHideBottomBar` (e.g. fullscreen moment viewer) — `BottomBar` returns null when hidden.
- **Debug APK build**: `scripts/build-debug-apk.ps1` + `npm run build:apk:debug`; `bundleInDebug` Gradle property (`android/app/build.gradle`) to inline the Hermes bundle into debug builds.

### Changed (round 5)
- **Conversation ordering fix** (`conversation.store.ts`): new `getConversationTimestamp` derives sort time from the latest *message* timestamp (created_at / create_time / createdAt / timestamp) instead of `update_time`, so opening or reading a chat no longer makes it jump to the top of MessageScreen; `upsertConversation` preserves an existing `latest_message` when the incoming payload lacks one.
- **Settings screen**: theme & palette pickers converted from floating popup modals back to inline expandable dropdown cards with dynamic M3E colors; privacy rows gain descriptions (`show_seen_desc`, `read_receipts_desc`); "Kiểu bảng màu" renamed "Kiểu giao diện" (vi).
- HistoryScreen: inline caption overlay on moments, input-focus state, bottom-bar hidden while the viewer is open.
- FriendsModal / HistorySelectFriendModal / RewindModal / UserAvatar: minor layout and avatar-fallback polish (`default_avatar.png`, `cloud_cover.png` assets).
- i18n: new/updated `settings.show_seen_desc`, `settings.read_receipts_desc` keys (vi/en).

### Added (round 4)
- **Friend request management** (`src/services/request.services.ts`): `getIncomingFriendRequests` / `getOutgoingFriendRequests` (primary API + data-API fallback, profile enrichment with safe fallback), accept / reject / cancel flows — wired into a rewritten FriendsModal with paginated incoming/outgoing sections (show-all / see-less).
- **FriendsModal upgrade**: top search bar with `findFriendByData` + friendship-status check, celebrity profile card with friend-slot progress bar (`friend_count` / `max_friends`), `sendCelebrityRequest` for celebrity follows, delete-friend confirm (`removeFriend` + `removeFriendLocal`), live Vietnam clock (`useVietnamClock`).
- **Chat upgrade** (`app/chat/[uid].tsx`): long-press reaction bar (❤️😂😮😢🔥👍) with `addReaction` store action, `EmojiPickerKeyboard` component (categorized emoji picker), moment-share cards inside chat (resolved via moments store), keyboard-aware input, conversation fallback by `friendUid`.
- **Optimistic messaging**: `sendMessage` now returns/propagates `client_token`; `messages.store.mergeMessages` matches incoming messages by id → `client_token` → optimistic content+timestamp (±25s), so sent messages never duplicate or flicker. `client_token` normalized in `normalizeMessage`.
- **Downloads**: `downloads.store.ts` (AsyncStorage + expo-file-system, image/video download to `documentDirectory/downloads`), `DownloadsListModal` browser, download action in HistoryMoreModal.
- **New UI components**: `ThemedBadge` (SVG gradient gold/celebrity badges replacing remote images — now used by UserAvatar/UserBadges), `RewindModal` (Locket Rewind highlights), `HistoryMoreModal` (moment actions: download / report / delete).
- **MenuModal** is now a real menu: Settings entry (→ `/settings`), Locket Rewind entry, app version/env info card.
- **Settings screen**: theme + palette style switch from inline segments to floating dropdown modals.
- **Realtime moments filtering**: `fetchFeed(reset, friendId)` + `selectedFriendId` in moment store; stream batches treated as snapshot when feed is empty.

### Changed (round 4)
- HistoryScreen: gallery/story unified `GalleryItem` list, viewability tracking, camera-top inset math, HH:MM timestamps, quick reactions + text reply row per moment.
- Header: menu button synchronized across camera & history (messages shortcut removed from header); avatar streak ring border 1.5 → 0.
- PagerView scroll locked while on the history page (`scrollEnabled` guards in `(tabs)/index.tsx` + MainHomeScreen) so vertical moment scroll no longer drags the pager.
- MessageScreen: unread avatars get a 2.5px primary ring (read = no ring).
- ProfileScreen: UID row with mask/reveal eye toggle; settings entry moved to MenuModal.
- Version downgraded 1.0.0 → 0.0.1 (`app.json`, `package.json`, build.gradle `versionName`, webConfig `clientVersion` → `Dev0.0.1`) — dev/testing build.
- Android deps: CameraX 1.6.0 suite added to `app/build.gradle` + guava `listenablefuture` conflict excluded.
- i18n: `chat.send_message` key (vi/en); streak label emoji removed.

### Fixed (round 4)
- `Friend` type accepts both snake_case and camelCase API shapes (`celebrity_data`/`celebrityData`, `friendship_status`/`friendshipStatus`) with index signature; `normalizeFoundUser` guarantees all fields present on search results.

### Added (round 3)
- **Realtime moments feed**: `createMomentsStream` bridges the chat socket (`on_moments` → `new_on_moments`) into the moments store. `startMomentsStream(friendId)` / `stopMomentsStream()` / `handleStreamMoments()` merge incoming moments into the feed (deduped by id, sorted newest-first) so the History screen updates live without pull-to-refresh.
- **`UserAvatar` component**: avatar with streak ring + gold/celebrity badge overlay, reused across the chat header, FriendsModal and HistorySelectFriendModal.
- **`UserBadges` component**: inline gold + celebrity badge icons next to a name.
- **`sortFriendsWithCelebrityFirst`** (`src/utils/friendSort.ts`): celebrities float to the top ordered by release/launch time, normal friends keep their original order. Applied to FriendsModal and HistorySelectFriendModal.

### Changed (round 3)
- **History screen rewrite**: inline moment viewer (replacing the separate `MomentViewer`/`MomentSlide`), improved 3-column gallery with load-more tile, quick-emoji reactions, `formatShortTimeAgo` timestamps, and open-moment-from-grid navigation.
- **HistorySelectFriendModal**: search bar always visible, celebrity-first ordering, more compact sheet (78%→66% width, 320→260 max-width), trailing chevrons removed.
- **FriendsModal**: shows `@username` under each name, celebrity-first sort, `UserAvatar` rows.
- `headerhome`: streak ring border 3 → 1.5 (thinner, web parity).
- Camera capture button: `overflow: hidden` so the inner shutter clips correctly.

### Fixed (round 3)
- **Badge / celebrity detection across API shapes**: `normalizeFriendDataV2` and `isCelebrityUser` now accept both snake_case and camelCase (`badge_type`, `is_temp`, `is_celebrity`, `celebrityData`, `friendshipStatus`), so gold/celebrity badges render regardless of which backend field naming is returned.

### Fixed (round 2)
- **Friends sync rewritten (Locket Wan architecture parity)**:
  - `fetchAndSyncFriends` now uses an in-flight mutex (concurrent calls reuse the same promise), serves cached friends instantly, and launches a background diff sync instead of blocking the UI.
  - `syncFriendsInBackground` diffs Firestore UIDs against the cache: fetches only new/incomplete profiles, removes unfriended ones, keeps the rest untouched.
  - Incomplete/placeholder profiles ("Friend" with no name) are healed with priority batch fetching (`batchSize 12`, 120ms delay, progressive UI updates per batch).
  - `fetchUserById` retries once on HTTP 429 with 600ms backoff instead of dropping the friend.
  - `createFallbackFriend` keeps a friend visible (uid + cached fields) even when its profile fetch fails, so the list never shrinks below the Firestore count.
  - Firestore page size raised 100 → 300 (fewer round trips; still follows `nextPageToken`).
- **Chat screen (web main-branch parity)**: date separators ("Jan 5, 14:02", shown on first message or >20min gap), sender avatars on incoming bubbles, quick-emoji reactions row, message reaction display, refactored send handler.

### Added (round 2)
- `HistorySelectFriendModal` component — history author selector matching web locket-dio main branch (HistorySelectFriend), with search and avatar rows.
- History screen now selects the author via Redux (`setHistoryAuthor`) shared with the main screen, replacing the local `PersonPickerModal`.

### Changed (round 2)
- `headerhome` refreshed (blur/glass header treatment); MainHomeScreen and MessageScreen layout polish.
- API constants updated.

### Fixed (round 1)
- **Friends list capped at 100**: profile fetching used batch-20 + 100ms delay and got rate-limited after ~100 `fetchUserV2` calls, silently dropping the rest. Now all profiles are fetched in parallel via a single `Promise.allSettled` (Locket Wan parity).
- **Friend list pagination**: `fetchFriendPage(pageToken?)` fetches 100 docs per page and follows Firestore `nextPageToken` until exhausted (Locket Wan `_fetchAllFirestoreDocs` logic). Firestore stays the source of truth; Dio `getAllFriendsV2` is only a fallback.
- **Video recording "cannot access photos" error**: recording now requests microphone permission (`useMicrophonePermissions`) before `recordAsync` and shows a localized alert on denial.
- **Hold-to-record restored** without breaking tap-to-capture: press-and-hold ≥350ms flips the camera to video mode, waits for the native use-case rebind (400ms), records until release, then returns to photo mode. Tap still captures a photo instantly.
- **History viewer gesture inconsistency**: the fullscreen moment viewer now pages vertically (swipe up/down), matching the story feed, instead of horizontal swiping.

### Added (round 1)
- **Friends session cache**: friends are fetched once per app process; automatic fetches (app open, screen focus) reuse the in-memory list. Manual refresh (FriendsModal button, History pull-to-refresh) always force-reloads. Logout resets the cache so switching accounts re-fetches.
- **History screen (main-branch parity)**:
  - 3-column moments gallery with rounded tiles, video badges, refresh pill, and trailing "+/-" load-more tile.
  - Fullscreen viewer: close button top-right, rounded-square media, owner row (avatar + name + timeAgo) below the media.
  - Activity pill + activity modal for own posts: viewer/reactor avatars stack, search, totals, "đã thả {emoji} {timeAgo}" / "✨ đã xem {timeAgo}" rows.
  - History-only friend picker ("Mọi người" / "Tôi" / friends) with search, separate from the main-screen friends tab.
  - Story ⇄ grid view toggle.
- **i18n**: new keys for activity, history picker, see-more, mic permission (vi + en).
- **Android release build pipeline**: `scripts/build-apk.ps1` (clears the JS bundle cache, runs `gradlew :app:assembleRelease`, copies the APK to `build-outputs/`), `android/` project with debug keystore tracked, release keystore ignored.

### Changed (round 1)
- Camera screen: photo/video mode toggle, flip camera, gallery upload icons; 10s/15s recording limit toggle with progress ring.
- Message/Profile screens refreshed to match the Locket Dio design language.
- `.gitignore`: ignore `build-outputs/`, `*.apk`, `.env` (`.env.example` tracked).
