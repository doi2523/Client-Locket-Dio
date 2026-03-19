import Sidebar from "@/components/Sidebar";

export default function LayoutWithSidebar({ Layout, children }) {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <div className="flex-1 bg-base-100 text-base-content overflow-hidden">
        <Layout>{children}</Layout>
      </div>
    </div>
  );
}
