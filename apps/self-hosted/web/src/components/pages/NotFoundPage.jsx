import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-base-100 text-base-content">
      <div className="text-center px-8 rounded-lg max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-primary">404</h1>
        <p className="mt-4 text-xl font-medium">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="mt-2">It seems we've lost this page somewhere.</p>
        <div className="mt-6">
          <Link to="/" className="px-6 py-3 btn btn-info text-lg font-semibold">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
