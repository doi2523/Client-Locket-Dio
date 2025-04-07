import React from 'react';

const Footer = () => {
  return (
<footer className="w-full bg-base-100 text-primary text-sm border-t border-gray-200 shadow-inner px-4 py-3">
  <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1">
    <p className="text-center md:text-left">
      © {new Date().getFullYear()} <span className="font-semibold font-lovehouse">Dio</span>. All rights reserved.
    </p>
    <p className="text-center md:text-right">
      <span className="underline cursor-pointer hover:text-blue-500 transition">Version 1.0.3 • API V2.0.3</span>
      <span className="ml-2 hidden sm:inline text-secondary">• Read more</span>
    </p>
  </div>
</footer>

  );
};

export default Footer;
