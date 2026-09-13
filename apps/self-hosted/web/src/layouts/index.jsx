import LocketLayout from "./locketLayout";
import DefaultLayout from "./mainLayout";

const getLayout = (pathname) => {
  if (pathname.startsWith("/locket")) {
    return LocketLayout;
  }
  return DefaultLayout;
};

export default getLayout;
