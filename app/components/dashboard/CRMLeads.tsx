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
  ChevronRight
} from "lucide-react";

export default function CRMLeads() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Date Added");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  const filters = ["All", "New", "Contacted", "Qualified", "Unqualified"];
  const sortOptions = ["Date Added", "Lead Score", "Last Contacted"];
  
  // Mock leads data
  const leads = [
    {
      id: "1",
      name: "Alex Johnson",
      company: "TechCorp Inc.",
      email: "alex@techcorp.com",
      status: "New",
      score: 85,
      lastContacted: "2 days ago",
      value: "$15K",
    },
    {
      id: "2",
      name: "Sarah Chen",
      company: "StartupX",
      email: "sarah@startupx.com",
      status: "Contacted",
      score: 92,
      lastContacted: "Today",
      value: "$25K",
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      company: "Growth Inc",
      email: "michael@growthinc.com",
      status: "Qualified",
      score: 78,
      lastContacted: "1 day ago",
      value: "$12K",
    },
    {
      id: "4",
      name: "Emily Davis",
      company: "TechSolutions",
      email: "emily@techsolutions.com",
      status: "New",
      score: 90,
      lastContacted: "3 days ago",
      value: "$18K",
    },
    {
      id: "5",
      name: "David Kim",
      company: "InnovateLtd",
      email: "david@innovateltd.com",
      status: "Qualified",
      score: 88,
      lastContacted: "Today",
      value: "$22K",
    },
  ];

  // Filter and sort leads
  const filteredLeads = leads
    .filter(lead => 
      filter === "All" || lead.status === filter
    )
    .filter(lead => 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Lead Score") {
        return b.score - a.score;
      } else if (sortBy === "Last Contacted") {
        // Simplified sorting - in reality would use actual dates
        return a.lastContacted === "Today" ? -1 : 1;
      }
      return 0; // Date Added (default)
    });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleDeleteSelected = () => {
    // In a real app, this would make an API call
    alert(`Deleting ${selectedLeads.length} leads`);
    setSelectedLeads([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leads
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and nurture your sales pipeline
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {/* Open add lead modal */}
          }
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium rounded-lg hover:from-violet-600 hover:to-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Lead
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
            placeholder="Search leads..."
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

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-violet-600"
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Lead
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Last Contacted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads([...selectedLeads, lead.id]);
                        } else {
                          setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                        }
                      }}
                      className="h-4 w-4 text-violet-600"
                    />
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  {lead.company}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full 
                    ${lead.status === "New" ? "bg-blue-100 text-blue-800" :
                      lead.status === "Contacted" ? "bg-yellow-100 text-yellow-800" :
                      lead.status === "Qualified" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  {lead.score}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  {lead.lastContacted}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  {lead.value}
                </td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button
                    onClick={() => {/* Open edit modal */}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {/* Delete lead */}
                    className="text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Empty state */}
            {filteredLeads.length === 0 && (
              <tr>
                <td colspan="8" className="px-4 py-8 text-center text-gray-500">
                  No leads found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeads.length > 0 && (
        <div className="mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedLeads.length === filteredLeads.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-violet-600"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedLeads.length} selected
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