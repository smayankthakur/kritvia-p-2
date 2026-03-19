import Sidebar from "@/app/components/dashboard/Sidebar";
import TopNav from "@/app/components/dashboard/TopNav";
import Overview from "@/app/components/dashboard/Overview";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 p-6 overflow-y-auto">
          <Overview />
        </main>
      </div>
    </div>
  );
}
