import React from "react";

const MockupiPhone = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="relative w-65 h-[550px] rounded-[45px] shadow-[0_0_2px_2px_rgba(255,255,255,0.1)] border-8 border-zinc-900">
      {/* Dynamic Island */}
        <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-[70px] h-[20px] bg-zinc-900 rounded-full z-20"></div>

        <div className="absolute -inset-[1px] border-[3px] border-zinc-700 border-opacity-40 rounded-[37px] pointer-events-none"></div>
        {/* <!-- Screen Content --> */}
        <div className="relative w-full h-full  rounded-[37px] overflow-hidden flex items-center justify-center  bg-zinc-900/10">
          <img src="/IMG_7016.PNG" alt="" className="h-full w-full" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-12 bg-zinc-600 blur-[80px]"></div>
        </div>

        {/* <!-- Left Side Buttons -->
        <!-- Silent Switch --> */}
        <div className="absolute left-[-12px] top-20 w-[6px] h-8 bg-zinc-900 rounded-l-md shadow-md"></div>
        
        {/* <!-- Volume Up --> */}
        <div className="absolute left-[-12px] top-36 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md"></div>
        
        {/* <!-- Volume Down --> */}
        <div className="absolute left-[-12px] top-52 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md"></div>
        
        {/* <!-- Right Side Button (Power) --> */}
        <div className="absolute right-[-12px] top-36 w-[6px] h-16 bg-zinc-900 rounded-r-md shadow-md"></div>
      </div>
    </div>
  );
};
export default MockupiPhone;