import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Footer from "../components/Footer";

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Header */}
      <Header />

      {/* Loading Overlay */}
      {isLoading && <Loading />}

      {/* Main content scrollable */}
      <main className="flex-1 overflow-y-scroll bg-base-200 text-base-content">
        {children}
      </main>

      {/* Footer cố định dưới */}
      <Footer />
    </div>
  );
};

export default DefaultLayout;
