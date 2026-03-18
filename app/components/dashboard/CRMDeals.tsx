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
  MoveVertical,
  ArrowRightLeft
} from "lucide-react";

export default function CRMDeals() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Value");
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  
  const filters = ["All", "Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
  const sortOptions = ["Value", "Date Added", "Close Date"];
  
  // Mock deals data
  const deals = [
    {
      id: "1",
      title: "Enterprise Software License",
      company: "TechCorp Inc.",
      value: 75000,
      stage: "Proposal",
      probability: 65,
      expectedClose: "2026-04-15",
      contact: "Alex Johnson",
    },
    {
      id: "2",
      title: "Marketing Automation Implementation",
      company: "StartupX",
      value: 45000,
      stage: "Negotiation",
      probability: 80,
      expectedClose: "2026-03-25",
      contact: "Sarah Chen",
    },
    {
      id: "3",
      title: "CRM Migration Project",
      company: "Growth Inc",
      value: 30000,
      stage: "Qualification",
      probability: 40,
      expectedClose: "2026-04-05",
      contact: "Michael Rodriguez",
    },
    {
      id: "4",
      title: "Website Redesign",
      company: "TechSolutions",
      value: 18000,
      stage: "Prospecting",
      probability: 25,
      expectedClose: "2026-05-10",
      contact: "Emily Davis",
    },
    {
      id: "5",
      title: "AI Consulting Engagement",
      company: "InnovateLtd",
      value: 60000,
      stage: "Proposal",
      probability: 60,
      expectedClose: "2026-04-20",
      contact: "David Kim",
    },
    {
      id: "6",
      title: "Managed Services Contract",
      company: "Enterprise Corp",
      value: 120000,
      stage: "Closed Won",
      probability: 100,
      expectedClose: "2026-03-10",
      contact: "Lisa Wang",
    },
  ];

  // Filter and sort deals
  const filteredDeals = deals
    .filter(deal => 
      filter === "All" || deal.stage === filter
    )
    .filter(deal => 
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      deal.company.toLowerCase().includes(search.toLowerCase()) ||
      deal.contact.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Value") {
        return b.value - a.value;
      } else if (sortBy === "Close Date") {
        return new Date(a.expectedClose).getTime() - new Date(b.expectedClose).getTime();
      }
      return 0; // Date Added (default)
    });

  // Group deals by stage
  const groupedDeals = filters.reduce((acc, stage) => {
    if (stage === "All") return acc;
    acc[stage] = filteredDeals.filter(deal => deal.stage === stage);
    return acc;
  }, {} as Record<string, typeof deals>);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, stage: string) => {
    const stageDeals = groupedDeals[stage] || [];
    if (e.target.checked) {
      setSelectedDeals(prev => [...new Set([...prev, ...stageDeals.map(d => d.id)])]);
    } else {
      setSelectedDeals(prev => prev.filter(id => !stageDeals.some(d => d.id === id)));
    }
  };

  const handleDeleteSelected = () => {
    // In a real app, this would make an API call
    alert(`Deleting ${selectedDeals.length} deals`);
    setSelectedDeals([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Deals
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your sales pipeline and forecast revenue
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {/* Open add deal modal */}
          }
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium rounded-lg hover:from-violet-600 hover:to-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Deal
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
            placeholder="Search deals..."
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

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4">
          {filters.map((stage) => {
            if (stage === "All") return null;
            
            const stageDeals = groupedDeals[stage] || [];
            
            return (
              <div key={stage} className="w-64 min-w-0 flex-1">
                <div className="mb-4">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {stage}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {stageDeals.length}
                      </span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        ${stageDeals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 p-4 min-h-[200px] bg-white dark:bg-gray-900 rounded-b-lg">
                    {stageDeals.length > 0 ? (
                      stageDeals.map((deal) => (
                        <div key={deal.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start space-x-3">
                           <div className={`flex-shrink-0 h-3 w-3 ${stage === "Prospecting" ? "bg-blue-500" :
                               stage === "Qualification" ? "bg-yellow-500" :
                               stage === "Proposal" ? "bg-violet-500" :
                               stage === "Negotiation" ? "bg-green-500" :
                               stage === "Closed Won" ? "bg-emerald-500" :
                               "bg-gray-500"} rounded-full mt-0.5`}></div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                {deal.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {deal.company}
                              </p>
                              <div className="flex items-center space-x-3 text-xs">
                                <div className="h-2 w-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  {deal.contact}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center space-x-3 text-xs">
                                <div className="h-2 w-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  ${deal.value.toLocaleString()}
                                </span>
                                <div className="h-2 w-2 bg-gray-200 dark:bg-gray-600 rounded ml-3"></div>
                                <span className="text-gray-500 dark:text-gray-400">
                                  {deal.probability}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
                            <ArrowRightLeft className="h-3 w-3" />
                            <span>Expected: {new Date(deal.expectedClose).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No deals in this stage
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedDeals.length > 0 && (
        <div className="mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedDeals.length === filteredDeals.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDeals(filteredDeals.map(deal => deal.id));
                  } else {
                    setSelectedDeals([]);
                  }
                }}
                className="h-4 w-4 text-violet-600"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedDeals.length} selected
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