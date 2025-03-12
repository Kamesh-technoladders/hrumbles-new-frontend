import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  Users,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  UserPlus,
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/jobs/ui/button";
import { Input } from "@/components/jobs/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/jobs/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/jobs/ui/select";
import { Badge } from "@/components/jobs/ui/badge";
import { Card } from "@/components/jobs/ui/card";
import { CreateJobModal } from "@/components/jobs/CreateJobModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/jobs/ui/tooltip";
import { AssignJobModal } from "@/components/jobs/job/AssignJobModal";
import { toast } from "sonner";
import { JobData } from "@/lib/types";
import { 
  getAllJobs,
  getJobsByType,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus
} from "@/services/jobService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/jobs/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/jobs/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/jobs/ui/dropdown-menu";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<JobData | null>(null);
  const [mockJobs, setMockJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        let jobs: JobData[];
        
        if (activeTab === "all") {
          jobs = await getAllJobs();
        } else {
          jobs = await getJobsByType(activeTab === "staffing" ? "Staffing" : "Augment Staffing");
        }
        
        setMockJobs(jobs);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to load jobs:", error);
        toast.error("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [activeTab]);

  const filteredJobs = mockJobs.filter((job) => {
    if (
      searchQuery &&
      !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.department.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.jobId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.clientOwner.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.location.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value && 
         (key === 'location' 
           ? !job.location.some(loc => loc.includes(value))
           : job[key as keyof typeof job] !== value)
      ) {
        return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const activeJobs = mockJobs.filter(job => job.status === "Active" || job.status === "OPEN").length;
  const pendingJobs = mockJobs.filter(job => job.status === "Pending" || job.status === "HOLD").length;
  const completedJobs = mockJobs.filter(job => job.status === "Completed" || job.status === "CLOSE").length;
  const totalJobs = mockJobs.length;

  const handleAssignJob = (job: JobData) => {
    setSelectedJob(job);
    setIsAssignModalOpen(true);
  };

  const handleEditJob = (job: JobData) => {
    setEditJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = (job: JobData) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      setStatusUpdateLoading(jobId);
      const updatedJob = await updateJobStatus(jobId, newStatus);
      
      setMockJobs(jobs => jobs.map(job => job.id === jobId ? updatedJob : job));
      toast.success(`Job status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status. Please try again.");
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      setActionLoading(true);
      await deleteJob(jobToDelete.id.toString());
      
      setMockJobs(jobs => jobs.filter(job => job.id !== jobToDelete.id));
      toast.success("Job deleted successfully");
      
      if (paginatedJobs.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job. Please try again.");
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleSaveJob = async (jobData: JobData) => {
    try {
      setActionLoading(true);
      let savedJob: JobData;
      
      if (mockJobs.some(job => job.id === jobData.id)) {
        savedJob = await updateJob(jobData.id.toString(), jobData);
        toast.success("Job updated successfully");
        
        setMockJobs(prev => prev.map(job => job.id === savedJob.id ? savedJob : job));
      } else {
        savedJob = await createJob(jobData);
        toast.success("Job created successfully");
        
        setMockJobs(prev => [savedJob, ...prev]);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(editJob ? "Failed to update job" : "Failed to create job");
    } finally {
      setActionLoading(false);
      setEditJob(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditJob(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "OPEN":
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "HOLD":
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "CLOSE":
      case "Completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-xl text-gray-500">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Job Dashboard</h1>
          <p className="text-gray-500">Manage and track all job postings</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Create New Job</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card animate-slide-up" style={{ animationDelay: "0ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Jobs</p>
              <h3 className="text-3xl font-bold">{totalJobs}</h3>
              <p className="text-xs text-gray-500 mt-1">All departments</p>
            </div>
            <div className="stat-icon stat-icon-blue">
              <Briefcase size={22} />
            </div>
          </div>
        </Card>

        <Card className="stat-card animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Jobs</p>
              <h3 className="text-3xl font-bold">{activeJobs}</h3>
              <p className="text-xs text-gray-500 mt-1">{Math.round((activeJobs / totalJobs) * 100) || 0}% of total</p>
            </div>
            <div className="stat-icon stat-icon-green">
              <Calendar size={22} />
            </div>
          </div>
        </Card>

        <Card className="stat-card animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Jobs</p>
              <h3 className="text-3xl font-bold">{pendingJobs}</h3>
              <p className="text-xs text-gray-500 mt-1">{Math.round((pendingJobs / totalJobs) * 100) || 0}% of total</p>
            </div>
            <div className="stat-icon stat-icon-yellow">
              <Clock size={22} />
            </div>
          </div>
        </Card>

        <Card className="stat-card animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completed Jobs</p>
              <h3 className="text-3xl font-bold">{completedJobs}</h3>
              <p className="text-xs text-gray-500 mt-1">{Math.round((completedJobs / totalJobs) * 100) || 0}% of total</p>
            </div>
            <div className="stat-icon stat-icon-purple">
              <CheckCircle size={22} />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="staffing">Staffing</TabsTrigger>
          <TabsTrigger value="augment_staffing">Augment Staffing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search for jobs..."
                className="pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>Filters</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Filter Jobs</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="department" className="text-right text-sm">
                      Department
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, department: value})}
                        value={filters.department || ""}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Departments</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Data">Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right text-sm">
                      Job Type
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, type: value})}
                        value={filters.type || ""}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="status" className="text-right text-sm">
                      Status
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, status: value})}
                        value={filters.status || ""}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="submissionType" className="text-right text-sm">
                      Submission
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, submissionType: value})}
                        value={filters.submissionType || ""}
                      >
                        <SelectTrigger id="submissionType">
                          <SelectValue placeholder="All Submissions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Submissions</SelectItem>
                          <SelectItem value="Internal">Internal</SelectItem>
                          <SelectItem value="Client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({})}
                  >
                    Reset Filters
                  </Button>
                  <Button type="submit">Apply Filters</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm animate-scale-in">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="table-header-cell">
                      <div className="flex items-center gap-1">
                        Job Title
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th scope="col" className="table-header-cell">Client Owner</th>
                    <th scope="col" className="table-header-cell">Created Date</th>
                    <th scope="col" className="table-header-cell">Submission</th>
                    <th scope="col" className="table-header-cell">Status</th>
                    <th scope="col" className="table-header-cell">Assigned To</th>
                    <th scope="col" className="table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedJobs.length > 0 ? (
                    paginatedJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition">
                        <td className="table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium">{job.title}</span>
                            <span className="text-xs text-gray-500">
                              {job.jobId}, {job.hiringMode}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell">{job.clientOwner}</td>
                        <td className="table-cell">{job.postedDate}</td>
                        <td className="table-cell">
                          <Badge
                            variant="outline"
                            className={`
                              ${job.submissionType === "Internal" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}
                              ${job.submissionType === "Client" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : ""}
                            `}
                          >
                            {job.submissionType}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 px-2 py-0">
                                {statusUpdateLoading === job.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className={getStatusBadgeClass(job.status)}
                                  >
                                    {job.status}
                                  </Badge>
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center">
                              <DropdownMenuItem 
                                className="text-green-600 focus:text-green-600 focus:bg-green-50"
                                onClick={() => handleStatusChange(job.id, "OPEN")}
                              >
                                OPEN
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-yellow-600 focus:text-yellow-600 focus:bg-yellow-50"
                                onClick={() => handleStatusChange(job.id, "HOLD")}
                              >
                                HOLD
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                                onClick={() => handleStatusChange(job.id, "CLOSE")}
                              >
                                CLOSE
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="table-cell">
                          {job.assignedTo ? (
                            <span>{job.assignedTo.name}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">Not assigned</span>
                          )}
                        </td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link to={`/jobs/${job.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleEditJob(job)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleAssignJob(job)}
                                  >
                                    <UserPlus className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Assign Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteJob(job)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        {loading ? (
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Loading jobs...
                          </div>
                        ) : (
                          'No jobs found matching your criteria.'
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="py-4 px-6 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredJobs.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredJobs.length}</span> results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="staffing" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search for jobs..."
                className="pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>Filters</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Filter Jobs</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="department" className="text-right text-sm">
                      Department
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, department: value})}
                        value={filters.department || ""}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Departments</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Data">Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right text-sm">
                      Job Type
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, type: value})}
                        value={filters.type || ""}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="status" className="text-right text-sm">
                      Status
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, status: value})}
                        value={filters.status || ""}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="submissionType" className="text-right text-sm">
                      Submission
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, submissionType: value})}
                        value={filters.submissionType || ""}
                      >
                        <SelectTrigger id="submissionType">
                          <SelectValue placeholder="All Submissions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Submissions</SelectItem>
                          <SelectItem value="Internal">Internal</SelectItem>
                          <SelectItem value="Client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({})}
                  >
                    Reset Filters
                  </Button>
                  <Button type="submit">Apply Filters</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm animate-scale-in">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="table-header-cell">
                      <div className="flex items-center gap-1">
                        Job Title
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th scope="col" className="table-header-cell">Client Owner</th>
                    <th scope="col" className="table-header-cell">Created Date</th>
                    <th scope="col" className="table-header-cell">Submission</th>
                    <th scope="col" className="table-header-cell">Status</th>
                    <th scope="col" className="table-header-cell">Assigned To</th>
                    <th scope="col" className="table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedJobs.length > 0 ? (
                    paginatedJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition">
                        <td className="table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium">{job.title}</span>
                            <span className="text-xs text-gray-500">
                              {job.jobId}, {job.hiringMode}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell">{job.clientOwner}</td>
                        <td className="table-cell">{job.postedDate}</td>
                        <td className="table-cell">
                          <Badge
                            variant="outline"
                            className={`
                              ${job.submissionType === "Internal" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}
                              ${job.submissionType === "Client" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : ""}
                            `}
                          >
                            {job.submissionType}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 px-2 py-0">
                                {statusUpdateLoading === job.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className={getStatusBadgeClass(job.status)}
                                  >
                                    {job.status}
                                  </Badge>
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center">
                              <DropdownMenuItem 
                                className="text-green-600 focus:text-green-600 focus:bg-green-50"
                                onClick={() => handleStatusChange(job.id, "OPEN")}
                              >
                                OPEN
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-yellow-600 focus:text-yellow-600 focus:bg-yellow-50"
                                onClick={() => handleStatusChange(job.id, "HOLD")}
                              >
                                HOLD
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                                onClick={() => handleStatusChange(job.id, "CLOSE")}
                              >
                                CLOSE
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="table-cell">
                          {job.assignedTo ? (
                            <span>{job.assignedTo.name}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">Not assigned</span>
                          )}
                        </td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link to={`/jobs/${job.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleEditJob(job)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleAssignJob(job)}
                                  >
                                    <UserPlus className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Assign Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteJob(job)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        {loading ? (
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Loading jobs...
                          </div>
                        ) : (
                          'No jobs found matching your criteria.'
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="py-4 px-6 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredJobs.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredJobs.length}</span> results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="augment_staffing" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search for jobs..."
                className="pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>Filters</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Filter Jobs</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="department" className="text-right text-sm">
                      Department
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, department: value})}
                        value={filters.department || ""}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Departments</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Data">Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right text-sm">
                      Job Type
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, type: value})}
                        value={filters.type || ""}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="status" className="text-right text-sm">
                      Status
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, status: value})}
                        value={filters.status || ""}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="submissionType" className="text-right text-sm">
                      Submission
                    </label>
                    <div className="col-span-3">
                      <Select 
                        onValueChange={(value) => setFilters({...filters, submissionType: value})}
                        value={filters.submissionType || ""}
                      >
                        <SelectTrigger id="submissionType">
                          <SelectValue placeholder="All Submissions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Submissions</SelectItem>
                          <SelectItem value="Internal">Internal</SelectItem>
                          <SelectItem value="Client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({})}
                  >
                    Reset Filters
                  </Button>
                  <Button type="submit">Apply Filters</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm animate-scale-in">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="table-header-cell">
                      <div className="flex items-center gap-1">
                        Job Title
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th scope="col" className="table-header-cell">Client Owner</th>
                    <th scope="col" className="table-header-cell">Created Date</th>
                    <th scope="col" className="table-header-cell">Submission</th>
                    <th scope="col" className="table-header-cell">Status</th>
                    <th scope="col" className="table-header-cell">Assigned To</th>
                    <th scope="col" className="table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedJobs.length > 0 ? (
                    paginatedJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition">
                        <td className="table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium">{job.title}</span>
                            <span className="text-xs text-gray-500">
                              {job.jobId}, {job.hiringMode}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell">{job.clientOwner}</td>
                        <td className="table-cell">{job.postedDate}</td>
                        <td className="table-cell">
                          <Badge
                            variant="outline"
                            className={`
                              ${job.submissionType === "Internal" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}
                              ${job.submissionType === "Client" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : ""}
                            `}
                          >
                            {job.submissionType}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 px-2 py-0">
                                {statusUpdateLoading === job.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className={getStatusBadgeClass(job.status)}
                                  >
                                    {job.status}
                                  </Badge>
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center">
                              <DropdownMenuItem 
                                className="text-green-600 focus:text-green-600 focus:bg-green-50"
                                onClick={() => handleStatusChange(job.id, "OPEN")}
                              >
                                OPEN
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-yellow-600 focus:text-yellow-600 focus:bg-yellow-50"
                                onClick={() => handleStatusChange(job.id, "HOLD")}
                              >
                                HOLD
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                                onClick={() => handleStatusChange(job.id, "CLOSE")}
                              >
                                CLOSE
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="table-cell">
                          {job.assignedTo ? (
                            <span>{job.assignedTo.name}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">Not assigned</span>
                          )}
                        </td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link to={`/jobs/${job.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleEditJob(job)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleAssignJob(job)}
                                  >
                                    <UserPlus className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Assign Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteJob(job)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Job</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        {loading ? (
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Loading jobs...
                          </div>
                        ) : (
                          'No jobs found matching your criteria.'
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="py-4 px-6 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredJobs.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredJobs.length}</span> results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CreateJobModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        editJob={editJob}
        onSave={handleSaveJob}
      />
      
      <AssignJobModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        job={selectedJob}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job "{jobToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteJob}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Jobs;
