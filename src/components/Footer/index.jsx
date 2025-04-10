import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-base-100 text-primary text-sm shadow-inner px-4 py-3">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} <span className="font-semibold font-lovehouse">Dio</span>. All rights reserved.
        </p>
        <p className="text-center md:text-right text-xs">
          <span className="cursor-pointer hover:text-blue-500 transition hover:underline">Version 1.0.3</span>
          <span> • </span>
          <span className="cursor-pointer hover:text-blue-500 transition hover:underline">API V2.0.3</span>
          <span className="cursor-pointer ml-2 hidden sm:inline text-secondary hover:underline">• Read more</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
