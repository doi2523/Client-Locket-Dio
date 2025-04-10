import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Footer from "../components/Footer";

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Handle loading state on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      {/* Main Content with Scroll */}
      <main className="flex-1 overflow-y-auto bg-base-200 text-base-content relative py-6">
        {isLoading && (
          <div className="absolute inset-0 z-20">
            <Loading />
          </div>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer at the bottom of main content */}
      <footer className="bg-base-300">
        <Footer />
      </footer>
    </div>
  );
};

export default DefaultLayout;