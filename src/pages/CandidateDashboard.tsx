import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Brain, FileText, Briefcase, BarChart3, Settings, LogOut, 
  Upload, CheckCircle, AlertCircle, Lightbulb, TrendingUp,
  BookOpen, Award, Target, ChevronRight, Sparkles, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const mockSkills = {
  matched: ["React", "TypeScript", "JavaScript", "Node.js", "Git"],
  missing: ["Docker", "Kubernetes", "AWS", "CI/CD"],
};

const mockFeedback = [
  { type: "improvement", text: "Add more quantifiable achievements to your experience section" },
  { type: "improvement", text: "Include relevant certifications for cloud technologies" },
  { type: "success", text: "Strong technical skills section with relevant technologies" },
  { type: "success", text: "Well-structured education and project sections" },
];

const mockJobs = [
  { id: 1, title: "Senior React Developer", company: "TechCorp", location: "Remote", match: 92, salary: "$120K - $150K" },
  { id: 2, title: "Full Stack Engineer", company: "StartupXYZ", location: "New York", match: 85, salary: "$100K - $130K" },
  { id: 3, title: "Frontend Lead", company: "DigitalAgency", location: "San Francisco", match: 78, salary: "$130K - $160K" },
];

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [hasResume, setHasResume] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }
    toast.success(`Resume "${file.name}" uploaded successfully!`);
    setHasResume(true);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const overallScore = 76;

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
            { icon: FileText, label: "My Resume", id: "resume" },
            { icon: Briefcase, label: "Job Matches", id: "jobs" },
            { icon: Lightbulb, label: "AI Insights", id: "insights" },
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
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf,.docx"
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">
              Welcome, {profile?.full_name || user?.email?.split("@")[0] || "there"}!
            </h1>
            <p className="text-muted-foreground">Your AI-powered career dashboard</p>
          </div>
          <Button variant="hero" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" />
            Update Resume
          </Button>
        </div>

        {hasResume ? (
          <>
            {/* Score Overview */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-1"
              >
                <Card variant="gradient" className="h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="hsl(var(--secondary))"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="12"
                          strokeDasharray={`${overallScore * 3.52} 352`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-display font-bold">{overallScore}%</span>
                        <span className="text-xs text-muted-foreground">Overall</span>
                      </div>
                    </div>
                    <h3 className="font-display font-semibold">Resume Score</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Your resume is performing well!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-3"
              >
                <Card variant="default" className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Resume Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Matched Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {mockSkills.matched.map((skill) => (
                            <Badge key={skill} variant="match">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Skills to Develop</h4>
                        <div className="flex flex-wrap gap-2">
                          {mockSkills.missing.map((skill) => (
                            <Badge key={skill} variant="missing">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Feedback Section */}
              <div className="col-span-2">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>AI Improvement Suggestions</CardTitle>
                    <CardDescription>Personalized tips to enhance your resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockFeedback.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-start gap-4 p-4 rounded-lg ${
                            item.type === "success" ? "bg-success/10" : "bg-warning/10"
                          }`}
                        >
                          {item.type === "success" ? (
                            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          ) : (
                            <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                          )}
                          <p className="text-sm">{item.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card variant="interactive">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold">23</div>
                        <div className="text-sm text-muted-foreground">Job Matches</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="interactive">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                        <Award className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold">5</div>
                        <div className="text-sm text-muted-foreground">Applications Sent</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="interactive">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold">4</div>
                        <div className="text-sm text-muted-foreground">Learning Paths</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Job Recommendations */}
            <div className="mt-8">
              <Card variant="default">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recommended Jobs</CardTitle>
                    <CardDescription>Based on your skills and experience</CardDescription>
                  </div>
                  <Button variant="outline">View All Jobs</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {mockJobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card variant="interactive" className="h-full">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-sm font-bold">
                                {job.company[0]}
                              </div>
                              <Badge variant="match">{job.match}% match</Badge>
                            </div>
                            <h4 className="font-medium mb-1">{job.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                              <span>{job.location}</span>
                              <span>•</span>
                              <span>{job.salary}</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          /* Upload Resume State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card variant="glass" className="max-w-2xl mx-auto">
              <CardContent className="p-12">
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-2">Upload Your Resume</h2>
                  <p className="text-muted-foreground mb-6">
                    Drag and drop your resume here, or click to browse.<br />
                    Supports PDF and DOCX formats.
                  </p>
                  <Button variant="hero" size="lg" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-5 h-5" />
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CandidateDashboard;
