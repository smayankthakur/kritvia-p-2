import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import Overview from "@/components/dashboard/Overview";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
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