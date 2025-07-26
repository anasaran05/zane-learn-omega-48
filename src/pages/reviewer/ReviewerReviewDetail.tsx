
import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  User,
  BookOpen,
  Clock,
  Download,
  CheckCircle,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReviewerReviewDetail() {
  const { submissionId } = useParams();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock submission data
  const submission = {
    id: submissionId,
    studentId: "student-1",
    studentName: "John Smith",
    studentEmail: "john.smith@email.com",
    courseId: "course-1",
    courseName: "Advanced Techniques",
    lessonId: "lesson-8",
    lessonTitle: "Strategic Implementation",
    submissionType: "task",
    submittedAt: "2024-01-26T14:30:00Z",
    content: "Here is my comprehensive analysis of the strategic implementation framework. I've identified three key areas where the current approach can be optimized:\n\n1. Resource Allocation: The current method doesn't account for variable demand patterns throughout different phases of implementation.\n\n2. Risk Management: There's a need for more robust contingency planning, especially regarding external dependencies.\n\n3. Performance Metrics: The existing KPIs don't adequately measure intermediate progress milestones.\n\nI propose a phased approach that addresses these concerns while maintaining the core strategic objectives. This would involve restructuring the timeline to allow for iterative feedback and adjustment periods.",
    fileUrl: null,
    maxScore: 100,
    currentScore: null,
    currentFeedback: null,
    status: "pending"
  };

  const handleSubmitReview = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback for the student.",
        variant: "destructive",
      });
      return;
    }

    if (!score.trim() || isNaN(Number(score))) {
      toast({
        title: "Invalid Score",
        description: "Please enter a valid numeric score.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Review Submitted",
        description: "Your review has been successfully submitted to the student.",
      });

      // Reset form
      setFeedback("");
      setScore("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSubmissionTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="sm" className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Review Submission</h1>
          <p className="text-muted-foreground">Provide feedback and scoring for student submission</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Student & Course Info */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{submission.studentName}</p>
                    <p className="text-sm text-muted-foreground">{submission.studentEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{submission.courseName}</p>
                    <p className="text-sm text-muted-foreground">{submission.lessonTitle}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {formatSubmissionTime(submission.submittedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Type</p>
                    <Badge variant="outline" className="mt-1">
                      {submission.submissionType}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submission Content */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Submission Content</CardTitle>
            </CardHeader>
            <CardContent>
              {submission.content && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {submission.content}
                  </pre>
                </div>
              )}
              
              {submission.fileUrl && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">submission-file.pdf</span>
                  <Button size="sm" variant="outline" className="ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Provide Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="score">Score (out of {submission.maxScore})</Label>
                <Input
                  id="score"
                  type="number"
                  placeholder="Enter score..."
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  min="0"
                  max={submission.maxScore}
                />
              </div>

              <div>
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide detailed feedback for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={8}
                />
              </div>

              <Button 
                onClick={handleSubmitReview} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                View Student Profile
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                View Course Details
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Contact Student
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
