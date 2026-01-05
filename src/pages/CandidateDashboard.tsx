import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Brain, FileText, Briefcase, BarChart3, Settings, LogOut, 
  Upload, CheckCircle, AlertCircle, Lightbulb, 
  BookOpen, Award, Target, ChevronRight, Sparkles, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AnalysisResult {
  overallScore: number;
  jobMatchScore: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  improvements: string[];
  strengths: string[];
  summary: string;
}

const mockJobs = [
  { id: 1, title: "Senior React Developer", company: "TechCorp", location: "Remote", match: 92, salary: "$120K - $150K" },
  { id: 2, title: "Full Stack Engineer", company: "StartupXYZ", location: "New York", match: 85, salary: "$100K - $130K" },
  { id: 3, title: "Frontend Lead", company: "DigitalAgency", location: "San Francisco", match: 78, salary: "$130K - $160K" },
];

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [hasResume, setHasResume] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeResume = async (text: string, jd?: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-resume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            resumeText: text,
            jobDescription: jd 
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (response.status === 402) {
          toast.error("AI credits exhausted. Please add funds.");
        } else {
          toast.error(error.error || "Analysis failed");
        }
        return;
      }

      const result: AnalysisResult = await response.json();
      setAnalysis(result);
      setHasResume(true);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For now, read as text - in production you'd use a PDF parser
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }
    
    toast.info(`Processing "${file.name}"...`);
    
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      await analyzeResume(text, jobDescription);
    } catch (error) {
      toast.error("Failed to read file");
    }
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

  const handleManualAnalysis = () => {
    if (!resumeText.trim()) {
      toast.error("Please enter your resume text");
      return;
    }
    analyzeResume(resumeText, jobDescription);
  };

  const overallScore = analysis?.overallScore || 0;
  const jobMatchScore = analysis?.jobMatchScore;
  const matchedSkills = analysis?.matchedSkills || [];
  const missingSkills = analysis?.missingSkills || [];
  const improvements = analysis?.improvements || [];
  const strengths = analysis?.strengths || [];

  const feedback = [
    ...improvements.map(text => ({ type: "improvement", text })),
    ...strengths.map(text => ({ type: "success", text })),
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
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
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
          accept=".pdf,.docx,.txt"
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Welcome, Amit Kumar!</h1>
            <p className="text-muted-foreground">Your AI-powered career dashboard</p>
          </div>
          <Button variant="hero" onClick={() => { setHasResume(false); setAnalysis(null); }}>
            <Upload className="w-4 h-4" />
            {hasResume ? "Upload New Resume" : "Upload Resume"}
          </Button>
        </div>

        {hasResume && analysis ? (
          <>
            {/* Score Overview */}
            <div className={`grid gap-6 mb-8 ${jobMatchScore !== null ? 'grid-cols-5' : 'grid-cols-4'}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-1"
              >
                <Card variant="gradient" className="h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <div className="relative w-28 h-28 mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          fill="none"
                          stroke="hsl(var(--secondary))"
                          strokeWidth="10"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="10"
                          strokeDasharray={`${overallScore * 3.02} 302`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-2xl font-display font-bold">{overallScore}%</span>
                        <span className="text-[10px] text-muted-foreground">Overall</span>
                      </div>
                    </div>
                    <h3 className="font-display font-semibold text-sm">Resume Score</h3>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      {overallScore >= 80 ? "Excellent!" : overallScore >= 60 ? "Good" : "Needs work"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {jobMatchScore !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="col-span-1"
                >
                  <Card variant="gradient" className="h-full border-2 border-accent/30">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      <div className="relative w-28 h-28 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            fill="none"
                            stroke="hsl(var(--secondary))"
                            strokeWidth="10"
                          />
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            fill="none"
                            stroke="hsl(var(--accent))"
                            strokeWidth="10"
                            strokeDasharray={`${jobMatchScore * 3.02} 302`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-2xl font-display font-bold">{jobMatchScore}%</span>
                          <span className="text-[10px] text-muted-foreground">JD Match</span>
                        </div>
                      </div>
                      <h3 className="font-display font-semibold text-sm">Job Match</h3>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {jobMatchScore >= 80 ? "Great fit!" : jobMatchScore >= 60 ? "Good match" : "Some gaps"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

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
                    {analysis.summary && (
                      <CardDescription>{analysis.summary}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Matched Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {matchedSkills.length > 0 ? matchedSkills.map((skill) => (
                            <Badge key={skill} variant="match">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          )) : (
                            <span className="text-sm text-muted-foreground">Upload resume to see skills</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Skills to Develop</h4>
                        <div className="flex flex-wrap gap-2">
                          {missingSkills.length > 0 ? missingSkills.map((skill) => (
                            <Badge key={skill} variant="missing">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          )) : (
                            <span className="text-sm text-muted-foreground">Great! No major gaps found</span>
                          )}
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
                      {feedback.length > 0 ? feedback.map((item, index) => (
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
                      )) : (
                        <p className="text-muted-foreground text-center py-4">No suggestions available</p>
                      )}
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
                        <div className="text-2xl font-display font-bold">{matchedSkills.length}</div>
                        <div className="text-sm text-muted-foreground">Skills Found</div>
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
                        <div className="text-2xl font-display font-bold">{strengths.length}</div>
                        <div className="text-sm text-muted-foreground">Strengths</div>
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
                        <div className="text-2xl font-display font-bold">{improvements.length}</div>
                        <div className="text-sm text-muted-foreground">Improvements</div>
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
            <Card variant="glass" className="max-w-3xl mx-auto">
              <CardContent className="p-8">
                {/* File Upload Section */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-6 ${
                    isDragging ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    {isAnalyzing ? (
                      <Loader2 className="w-7 h-7 text-primary animate-spin" />
                    ) : (
                      <Upload className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <h2 className="text-xl font-display font-bold mb-2">
                    {isAnalyzing ? "Analyzing Your Resume..." : "Upload Your Resume"}
                  </h2>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Drag and drop your resume here, or click to browse.<br />
                    Supports PDF, DOCX, and TXT formats.
                  </p>
                  <Button 
                    variant="hero" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                </div>

                {/* Or Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">OR paste your resume text</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Manual Text Input */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Resume Text</label>
                    <Textarea
                      placeholder="Paste your resume content here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Description (Optional)</label>
                    <Textarea
                      placeholder="Paste the job description to compare against..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    onClick={handleManualAnalysis}
                    disabled={isAnalyzing || !resumeText.trim()}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analyze Resume with AI
                      </>
                    )}
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
