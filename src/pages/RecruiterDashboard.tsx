import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Brain, Users, Briefcase, FileText, BarChart3, Settings, LogOut, 
  Plus, Search, Filter, MoreVertical, ChevronDown, TrendingUp, 
  UserCheck, Clock, Target, Upload, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const mockJobs = [
  { id: 1, title: "Senior React Developer", department: "Engineering", applicants: 45, status: "active", posted: "2 days ago" },
  { id: 2, title: "Product Manager", department: "Product", applicants: 32, status: "active", posted: "5 days ago" },
  { id: 3, title: "UX Designer", department: "Design", applicants: 28, status: "paused", posted: "1 week ago" },
];

const mockCandidates = [
  { id: 1, name: "Sarah Johnson", role: "React Developer", score: 92, skills: ["React", "TypeScript", "Node.js"], status: "shortlisted" },
  { id: 2, name: "Mike Chen", role: "Frontend Engineer", score: 87, skills: ["Vue", "JavaScript", "CSS"], status: "review" },
  { id: 3, name: "Emily Davis", role: "Full Stack Developer", score: 78, skills: ["React", "Python", "SQL"], status: "new" },
  { id: 4, name: "Alex Thompson", role: "Software Engineer", score: 65, skills: ["Java", "Spring", "AWS"], status: "rejected" },
];

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .maybeSingle();
        setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const stats = [
    { label: "Active Jobs", value: "12", change: "+2", icon: Briefcase, color: "text-primary" },
    { label: "Total Applicants", value: "248", change: "+34", icon: Users, color: "text-accent" },
    { label: "Shortlisted", value: "42", change: "+8", icon: UserCheck, color: "text-success" },
    { label: "Avg. Match Score", value: "76%", change: "+5%", icon: Target, color: "text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl fixed h-screen">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">HireSense AI</span>
          </Link>
        </div>

        <nav className="px-3 space-y-1">
          {[
            { icon: BarChart3, label: "Overview", id: "overview" },
            { icon: Briefcase, label: "Jobs", id: "jobs" },
            { icon: Users, label: "Candidates", id: "candidates" },
            { icon: FileText, label: "Resumes", id: "resumes" },
            { icon: Settings, label: "Settings", id: "settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">
              Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "there"}!
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your recruitment.</p>
          </div>
          <Button variant="hero">
            <Plus className="w-4 h-4" />
            Post New Job
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <Badge variant="success" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-3xl font-display font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Active Jobs */}
          <div className="col-span-3">
            <Card variant="default">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Job Postings</CardTitle>
                  <CardDescription>Manage your open positions</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{job.title}</h4>
                          <Badge variant={job.status === "active" ? "success" : "secondary"}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.applicants} applicants</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {job.posted}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="col-span-2 space-y-6">
            <Card variant="gradient">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">Bulk Resume Upload</h3>
                    <p className="text-sm text-muted-foreground">Upload multiple resumes for AI analysis</p>
                  </div>
                </div>
                <Button variant="hero-outline" className="w-full">
                  Upload Resumes
                </Button>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base">Top Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCandidates.slice(0, 3).map((candidate) => (
                    <div key={candidate.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-medium text-primary-foreground">
                        {candidate.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{candidate.name}</div>
                        <div className="text-xs text-muted-foreground">{candidate.role}</div>
                      </div>
                      <Badge variant="match">{candidate.score}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Candidate Pipeline */}
        <div className="mt-8">
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Candidate Pipeline</CardTitle>
                <CardDescription>Track candidates through your hiring process</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search candidates..." className="pl-9 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Candidate</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Applied For</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Skills</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Match Score</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCandidates.map((candidate) => (
                      <tr key={candidate.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xs font-medium">
                              {candidate.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="font-medium">{candidate.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{candidate.role}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-1 flex-wrap">
                            {candidate.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="skill" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Progress value={candidate.score} className="w-20 h-2" />
                            <span className={`text-sm font-medium ${
                              candidate.score >= 80 ? "text-success" : 
                              candidate.score >= 60 ? "text-warning" : "text-destructive"
                            }`}>
                              {candidate.score}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={
                            candidate.status === "shortlisted" ? "success" :
                            candidate.status === "review" ? "warning" :
                            candidate.status === "rejected" ? "destructive" : "secondary"
                          }>
                            {candidate.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="ghost" size="sm">View Profile</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
