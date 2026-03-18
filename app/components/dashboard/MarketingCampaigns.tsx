import { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp,
  ChevronDown,
  Edit,
  Trash2,
  Check,
  ChevronRight,
  Activity,
  PieChart,
  BarChart3
} from "lucide-react";

export default function MarketingCampaigns() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Performance");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  
  const filters = ["All", "Active", "Scheduled", "Completed", "Paused"];
  const sortOptions = ["Performance", "Budget", "Start Date", "End Date"];
  
  // Mock campaigns data
  const campaigns = [
    {
      id: "1",
      name: "Q1 Product Launch",
      type: "Email + Social",
      status: "Active",
      budget: 25000,
      spent: 18500,
      roi: 340,
      startDate: "2026-01-15",
      endDate: "2026-03-31",
      impressions: 125000,
      clicks: 3200,
      conversions: 85,
    },
    {
      id: "2",
      name: "Webinar Series",
      type: "Email + Landing Page",
      status: "Scheduled",
      budget: 12000,
      spent: 2000,
      roi: 0, // Not started yet
      startDate: "2026-04-01",
      endDate: "2026-04-15",
      impressions: 0,
      clicks: 0,
      conversions: 0,
    },
    {
      id: "3",
      name: "Holiday Sale Promotion",
      type: "Social + Search Ads",
      status: "Completed",
      budget: 35000,
      spent: 34500,
      roi: 280,
      startDate: "2025-11-20",
      endDate: "2025-12-31",
      impressions: 450000,
      clicks: 12500,
      conversions: 320,
    },
    {
      id: "4",
      name: "Brand Awareness Campaign",
      type: "Display + Video",
      status: "Paused",
      budget: 50000,
      spent: 22000,
      roi: 120,
      startDate: "2026-02-01",
      endDate: "2026-05-31",
      impressions: 850000,
      clicks: 18000,
      conversions: 145,
    },
    {
      id: "5",
      name: "Lead Nurturing Sequence",
      type: "Email Automation",
      status: "Active",
      budget: 8000,
      spent: 6500,
      roi: 420,
      startDate: "2026-01-01",
      endDate: "2026-06-30",
      impressions: 45000,
      clicks: 5200,
      conversions: 180,
    },
  ];

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter(campaign => 
      filter === "All" || campaign.status === filter
    )
    .filter(campaign => 
      campaign.name.toLowerCase().includes(search.toLowerCase()) ||
      campaign.type.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Performance") {
        return b.roi - a.roi;
      } else if (sortBy === "Budget") {
        return b.budget - a.budget;
      } else if (sortBy === "Start Date") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else if (sortBy === "End Date") {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      }
      return 0; // Default
    });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCampaigns(filteredCampaigns.map(campaign => campaign.id));
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handleDeleteSelected = () => {
    // In a real app, this would make an API call
    alert(`Deleting ${selectedCampaigns.length} campaigns`);
    setSelectedCampaigns([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Marketing Campaigns
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Plan, execute, and analyze your marketing initiatives
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {/* Open add campaign modal */}
          }
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium rounded-lg hover:from-violet-600 hover:to-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Campaign
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="relative">
          <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer">
            <Filter className="h-4 w-4" />
            <span>{filter}</span>
            <ChevronDown className="h-3 w-3 ml-auto" />
          </div>
          {/* Dropdown menu would go here in a real app */}
        </div>

        <div className="relative">
          <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer">
            <TrendingUp className="h-4 w-4" />
            <span>{sortBy}</span>
            <ChevronDown className="h-3 w-3 ml-auto" />
          </div>
          {/* Dropdown menu would go here in a real app */}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Budget</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Spent</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Average ROI</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.filter(c => c.roi > 0).length || 0)}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Active Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {campaigns.filter(c => c.status === "Active").length}
          </p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCampaigns.length === filteredCampaigns.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-violet-600"
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Campaign
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Budget
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                ROI
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Conversions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                        } else {
                          setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                        }
                      }}
                      className="h-4 w-4 text-violet-600"
                    />
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-3 w-3 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                      {campaign.name.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-xs text-gray-500">{campaign.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  {campaign.type}
                </td>
                 <td className="px-4 py-4">
                   <span className={`px-2 py-1 text-xs rounded-full 
                     ${campaign.status === "Active" ? "bg-emerald-100 text-emerald-800" :
                       campaign.status === "Scheduled" ? "bg-blue-100 text-blue-800" :
                       campaign.status === "Completed" ? "bg-green-100 text-green-800" :
                       campaign.status === "Paused" ? "bg-yellow-100 text-yellow-800" :
                       "bg-gray-100 text-gray-800"}`}>
                     {campaign.status}
                   </span>
                 </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  ${campaign.budget.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  {campaign.roi > 0 ? `+${campaign.roi}%` : "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  {campaign.conversions}
                </td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button
                    onClick={() => {/* Open edit modal */}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {/* Delete campaign */}
                    className="text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Empty state */}
            {filteredCampaigns.length === 0 && (
              <tr>
                <td colspan="8" className="px-4 py-8 text-center text-gray-500">
                  No campaigns found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCampaigns.length > 0 && (
        <div className="mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedCampaigns.length === filteredCampaigns.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-violet-600"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedCampaigns.length} selected
              </span>
            </div>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}