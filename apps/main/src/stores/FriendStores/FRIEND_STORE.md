# Friend Store Usage Guide (Normalized State)

## 1. State Structure

Store được thiết kế theo kiểu **Normalized State**.

```js
state = {
  // Danh sách UID để render theo thứ tự (order)
  // ⚠️ CHỈ chứa UID, không chứa object user
  friendList: ["uid1", "uid2", "uid3"],

  // Map chứa thông tin user (data chính)
  // Dùng để lấy thông tin nhanh O(1)
  friendDetailsMap: {
    uid1: {
      uid: "uid1",
      firstName: "Dio",
      lastName: "Nguyen",
      username: "dio",
      profilePic: "..."
    }
  },

  // Map chứa thông tin quan hệ bạn bè
  // hidden, celebrity, createdAt, sharedHistoryOn...
  friendRelationsMap: {
    uid1: {
      hidden: false,
      isCelebrity: false,
      createdAt: 1711000000,
      updatedAt: 1712000000,
      sharedHistoryOn: 1713000000
    }
  }
}
```

---

## 2. Data Flow

```
Server/API
   ↓
friendDetailsMap      (thông tin user)
friendRelationsMap    (thông tin quan hệ)
   ↓
rebuildFriendList()   (sort theo celebrity, createdAt, hidden...)
   ↓
friendList (uid đã sort)
   ↓
UI render theo friendList
   ↓
FriendItem lấy data từ map bằng uid
```

---

## 3. Load danh sách bạn bè

Dùng khi app start hoặc vào trang Friend.

```js
const loadFriends = useFriendStoreV3(s => s.loadFriends);

useEffect(() => {
  loadFriends();
}, []);
```

---

## 4. Render danh sách bạn bè

⚠️ friendList chỉ là mảng UID, không phải object friend.

```js
const friendIds = useFriendStoreV3(s => s.friendList);

return friendIds.map(uid => (
  <FriendItem key={uid} uid={uid} />
));
```

---

## 5. Lấy thông tin friend trong FriendItem

```js
export default function FriendItem({ uid }) {
  const friend = useFriendStoreV3(s => s.friendDetailsMap[uid]);
  const relation = useFriendStoreV3(s => s.friendRelationsMap[uid] || {});

  const isHidden = relation.hidden;
  const createdAt = relation.createdAt;
}
```

---

## 6. Ẩn bạn bè

```js
const hiddenUser = useFriendStoreV3(s => s.hiddenUserState);

hiddenUser(uid, true);  // ẩn
hiddenUser(uid, false); // bỏ ẩn
```

---

## 7. Thêm bạn bè

```js
const addFriend = useFriendStoreV3(s => s.addFriendLocal);

addFriend(friendObject);
```

---

## 8. Xoá bạn bè

```js
const removeFriend = useFriendStoreV3(s => s.removeFriendLocal);

removeFriend(uid);
```

---

## 9. rebuildFriendList dùng để làm gì?

Dùng để **tạo lại thứ tự hiển thị bạn bè** khi:

| Hành động | Rebuild |
|-----------|---------|
| Load local | ✅ |
| Sync server | ✅ |
| Add friend | ✅ |
| Remove friend | ✅ |
| Hidden/unhidden | ✅ |
| Celebrity thay đổi | ✅ |
| Update avatar | ❌ |
| Update username | ❌ |

---

## 10. rebuildFriendList hoạt động như nào?

```js
rebuildFriendList: () => {
  const { friendDetailsMap, friendRelationsMap } = get();

  const merged = Object.keys(friendDetailsMap).map(uid => ({
    uid,
    isCelebrity: friendRelationsMap[uid]?.isCelebrity ?? false,
    hidden: friendRelationsMap[uid]?.hidden ?? false,
    createdAt: friendRelationsMap[uid]?.createdAt ?? 0,
  }));

  const sorted = sortFriends(merged);

  set({ friendList: sorted.map(f => f.uid) });
}
```

---

## 11. Rule quan trọng

```
Map = dữ liệu thật
List = thứ tự hiển thị
UI = render từ List, đọc data từ Map
```

Không lưu data user trong friendList để tránh:
- Lệch data
- Re-render nhiều
- List nặng
- Khó update

---

## 12. Pattern này dùng cho toàn bộ app

| Feature | Map | List |
|--------|-----|------|
| Friends | friendDetailsMap | friendList |
| Chat | messageMap | messageIds |
| Posts | postMap | postIds |
| Comments | commentMap | commentIds |
| Notifications | notiMap | notiIds |

Pattern này gọi là: **Normalized State**
Được dùng trong: Redux Toolkit, Facebook, Discord, Messenger.