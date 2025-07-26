
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { 
  BookOpen, 
  Users, 
  Award, 
  Play, 
  CheckCircle, 
  Star,
  GraduationCap,
  Target,
  Clock,
  ArrowRight,
  Loader2
} from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { data: role } = useUserRole();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user && role) {
      if (role === 'admin' || role === 'staff') {
        navigate('/admin/dashboard');
      } else if (role === 'reviewer') {
        navigate('/reviewer/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [user, role, navigate]);

  const handleStartTraining = () => {
    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth');
    }, 1500);
  };

  // Don't render the landing page if user is authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cherry-900/20 via-background to-maroon-900/20" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 border-cherry-500/30 text-cherry-400">
              Elite Training Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
              Zane Ωmega LMS
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Transform your potential into mastery with our cutting-edge learning management system. 
              Designed for elite performance and exceptional results.
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-cherry hover:opacity-90 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-cherry-500/25 transition-all duration-300"
              onClick={handleStartTraining}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Preparing Your Training...
                </>
              ) : (
                <>
                  Start Training
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">What You'll Master</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive training modules designed to elevate your skills and knowledge
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Advanced Techniques",
                description: "Master cutting-edge methodologies and proven strategies"
              },
              {
                icon: Target,
                title: "Precision Training",
                description: "Focused learning paths tailored to your specific goals"
              },
              {
                icon: Award,
                title: "Elite Certification",
                description: "Earn recognition for your achievements and expertise"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="text-center p-6 card-hover">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-cherry rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our proven learning methodology ensures maximum retention and practical application
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Learn",
                description: "Absorb knowledge through interactive lessons and video content"
              },
              {
                icon: Play,
                title: "Practice",
                description: "Apply concepts through hands-on exercises and real-world scenarios"
              },
              {
                icon: Users,
                title: "Review",
                description: "Get expert feedback and guidance from certified instructors"
              },
              {
                icon: CheckCircle,
                title: "Master",
                description: "Achieve mastery and unlock advanced training modules"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-cherry rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from our elite graduates who have transformed their careers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marcus Chen",
                role: "Senior Analyst",
                content: "The training methodology completely revolutionized my approach. The step-by-step guidance and expert reviews made all the difference.",
                rating: 5
              },
              {
                name: "Sarah Rodriguez",
                role: "Team Leader",
                content: "Exceptional quality and depth. The practical exercises prepared me for real-world challenges better than any other program.",
                rating: 5
              },
              {
                name: "David Kim",
                role: "Specialist",
                content: "The certification from Zane Ωmega opened doors I never thought possible. Highly recommend to anyone serious about excellence.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-6 card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gradient mb-4">Zane Ωmega</h3>
              <p className="text-muted-foreground">
                Elite training platform for exceptional results and mastery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Training</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Advanced Courses</li>
                <li>Certification Programs</li>
                <li>Expert Reviews</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Help Center</li>
                <li>Community</li>
                <li>Technical Support</li>
                <li>Training Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>LinkedIn</li>
                <li>Twitter</li>
                <li>Discord</li>
                <li>Newsletter</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 Zane Ωmega LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
