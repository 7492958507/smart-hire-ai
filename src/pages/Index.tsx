import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Sparkles, Target, Users, FileText, BarChart3, ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">HireSense AI</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="hero">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeIn}>
              <Badge variant="skill" className="mb-6">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Recruitment
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
            >
              Smart Hiring with{" "}
              <span className="gradient-text">AI Intelligence</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Transform your recruitment process with AI-powered resume analysis, 
              intelligent job matching, and automated skill gap detection.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup&role=recruiter">
                <Button variant="hero" size="xl">
                  I'm a Recruiter
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth?mode=signup&role=candidate">
                <Button variant="hero-outline" size="xl">
                  I'm a Candidate
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeIn}
              className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
            >
              {[
                { value: "95%", label: "Accuracy Rate" },
                { value: "10x", label: "Faster Screening" },
                { value: "50K+", label: "Resumes Analyzed" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-display font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Powerful AI for Modern Hiring
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to streamline your recruitment workflow and find the perfect candidates.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Smart Resume Parsing",
                description: "AI extracts skills, experience, and qualifications automatically from any resume format.",
                color: "from-primary to-accent"
              },
              {
                icon: Target,
                title: "JD Match Scoring",
                description: "Get instant compatibility scores between candidates and job descriptions.",
                color: "from-success to-primary"
              },
              {
                icon: BarChart3,
                title: "Skill Gap Analysis",
                description: "Identify missing skills and get personalized learning recommendations.",
                color: "from-warning to-destructive"
              },
              {
                icon: Users,
                title: "Candidate Pipeline",
                description: "Manage your entire hiring funnel with intelligent status tracking.",
                color: "from-accent to-primary"
              },
              {
                icon: Zap,
                title: "Instant Feedback",
                description: "Candidates receive AI-powered resume improvement suggestions.",
                color: "from-primary to-success"
              },
              {
                icon: Shield,
                title: "ATS Optimization",
                description: "Ensure resumes pass applicant tracking systems with smart formatting tips.",
                color: "from-destructive to-warning"
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="interactive" className="h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Process</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              How HireSense Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple three-step process to revolutionize your hiring
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Upload Resume",
                description: "Upload resumes in PDF or DOCX format. Our AI instantly parses and extracts key information."
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Advanced NLP matches skills with job requirements and calculates compatibility scores."
              },
              {
                step: "03",
                title: "Smart Decisions",
                description: "Get actionable insights, shortlist top candidates, and provide feedback automatically."
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-7xl font-display font-bold text-primary/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <Card variant="glass" className="relative z-10 mt-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-display font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <Card variant="gradient" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
            <CardContent className="relative z-10 p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Transform Your Hiring?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of companies using AI to find the perfect candidates faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="lg">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="hero-outline" size="lg">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  14-day free trial
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold">HireSense AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 HireSense AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
