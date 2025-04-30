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
    <div className="overflow-y-scroll grid grid-rows-[auto_1fr_auto]">
      {/* Fixed Header */}
      <Header />
      {isLoading && (
        <div className="absolute inset-0 z-20">
          <Loading />
        </div>
      )}
      {/* Main Content with Scroll */}
      <main className="flex-1 h-[93vh] bg-base-200 text-base-content relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
