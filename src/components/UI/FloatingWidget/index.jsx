import { Suspense, lazy } from "react";
const MyBirthday = lazy(() => import("./MyBirthday"));
const FloatingNotification = lazy(() => import("./Notification"));
const ContactSupportButton = lazy(() => import("./ContactSupport"));

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <Suspense
        fallback={
          <div className="animate-pulse w-12 h-12 bg-base-300 rounded-full" />
        }
      >
        <FloatingNotification />
      </Suspense>
      <Suspense
        fallback={
          <div className="animate-pulse w-12 h-12 bg-base-300 rounded-full" />
        }
      >
        <MyBirthday />
      </Suspense>

      <Suspense
        fallback={
          <div className="animate-pulse w-12 h-12 bg-base-300 rounded-full" />
        }
      >
        <ContactSupportButton />
      </Suspense>
    </div>
  );
}
