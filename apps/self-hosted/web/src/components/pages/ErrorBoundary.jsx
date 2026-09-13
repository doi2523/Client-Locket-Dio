import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = async () => {
    try {
      // 1. Clear local + session storage
      // localStorage.clear();
      // sessionStorage.clear();

      // 2. Clear Cache API (PWA cache nếu có)
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // 3. Clear IndexedDB
      // if ("indexedDB" in window) {
      //   const databases = await indexedDB.databases?.();
      //   if (databases) {
      //     await Promise.all(
      //       databases.map((db) => {
      //         if (db.name) {
      //           return new Promise((resolve) => {
      //             const request = indexedDB.deleteDatabase(db.name);
      //             request.onsuccess = resolve;
      //             request.onerror = resolve;
      //             request.onblocked = resolve;
      //           });
      //         }
      //       }),
      //     );
      //   }
      // }

      // 4. Unregister Service Workers
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }

      // 5. Reload
      window.location.reload();
    } catch (err) {
      console.error("Lỗi khi reset app:", err);
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[100dvh] bg-base-100 text-base-content flex flex-col items-center justify-center p-4 md:p-6">
          <div className="w-full max-w-4xl text-left">
            <p className="text-6xl md:text-7xl font-semibold mb-4 md:mb-6">
              {":("}
            </p>
            <p className="text-xl md:text-2xl mb-3 md:mb-4 font-bold">
              Oops! Có lỗi xảy ra rồi.
            </p>
            <p className="text-sm md:text-base opacity-80 mb-4 md:mb-6">
              Ứng dụng web Locket Dio đang gặp sự cố không mong muốn. Bạn có thể
              thử khởi động lại hoặc liên hệ cộng đồng để được hỗ trợ.
            </p>

            {this.state.error && (
              <div className="rounded-md bg-base-300 p-3 md:p-4 mb-4 md:mb-6 shadow max-h-[40vh] overflow-auto">
                <p className="text-xs md:text-sm font-mono break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-[10px] md:text-xs mt-2 whitespace-pre-wrap font-mono">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <button
                onClick={this.handleReload}
                className="group relative rounded-2xl px-6 py-3 bg-black text-white font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black/40"
              >
                <span className="inline-flex items-center gap-2">
                  Khởi động lại
                </span>
              </button>

              <a
                href="https://discord.com/invite/47buy9nMGc"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl px-6 py-3 bg-base-300 font-semibold transition-all duration-200 hover:scale-[1.03] hover:bg-base-200 active:scale-95 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-base-content/20 text-center"
              >
                <span className="inline-flex items-center gap-2">
                  Tham gia cộng đồng
                </span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
