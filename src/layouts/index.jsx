import LocketLayout from "./locketLayout";
import DefaultLayout from "./mainLayout";


const getLayout = (pathname) => {
  if (pathname.includes("/test") || pathname.includes("/locket")) {
    return LocketLayout;
  }
  return DefaultLayout;
};

export default getLayout;
