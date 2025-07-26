
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Eye,
  Calendar,
  User
} from "lucide-react";

export default function StudentAssignments() {
  const [assignments] = useState([
    {
      id: 1,
      title: "Strategic Analysis Report",
      course: "Advanced Techniques",
      description: "Analyze the provided case study and submit a comprehensive strategic analysis report detailing your findings and recommendations.",
      dueDate: "2024-02-15",
      status: "pending",
      submittedDate: "2024-02-10",
      score: null,
      feedback: null,
      type: "report"
    },
    {
      id: 2,
      title: "Precision Training Assessment",
      course: "Precision Training",
      description: "Complete the practical assessment demonstrating the techniques learned in lessons 1-4.",
      dueDate: "2024-02-08",
      status: "graded",
      submittedDate: "2024-02-07",
      score: 92,
      feedback: "Excellent work! Your technique demonstration was thorough and well-executed. Minor improvements needed in section 3.",
      type: "assessment"
    },
    {
      id: 3,
      title: "Foundation Quiz Retake",
      course: "Foundation Course",
      description: "Retake the final quiz to improve your understanding of core concepts.",
      dueDate: "2024-02-20",
      status: "not_started",
      submittedDate: null,
      score: null,
      feedback: null,
      type: "quiz"
    },
    {
      id: 4,
      title: "Implementation Project",
      course: "Advanced Techniques",
      description: "Design and implement a solution using the methodologies covered in the advanced module.",
      dueDate: "2024-02-25",
      status: "overdue",
      submittedDate: null,
      score: null,
      feedback: null,
      type: "project"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "not_started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "overdue": return <AlertCircle className="h-4 w-4" />;
      case "not_started": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "graded": return "Graded";
      case "pending": return "Pending Review";
      case "overdue": return "Overdue";
      case "not_started": return "Not Started";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Assignments</h1>
        <p className="text-muted-foreground">Track and submit your course assignments</p>
      </motion.div>

      {/* Assignment Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{assignments.filter(a => a.status === 'graded').length}</div>
                <p className="text-sm text-muted-foreground">Graded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{assignments.filter(a => a.status === 'pending').length}</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{assignments.filter(a => a.status === 'overdue').length}</div>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{assignments.filter(a => a.status === 'not_started').length}</div>
                <p className="text-sm text-muted-foreground">To Do</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assignments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        {assignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {assignment.course}
                    </div>
                  </div>
                  <Badge className={getStatusColor(assignment.status)} variant="secondary">
                    {getStatusIcon(assignment.status)}
                    <span className="ml-1">{getStatusText(assignment.status)}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                    {assignment.submittedDate && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Submitted: {assignment.submittedDate}</span>
                      </div>
                    )}
                  </div>

                  {assignment.score !== null && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Score:</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {assignment.score}%
                      </Badge>
                    </div>
                  )}

                  {assignment.feedback && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Instructor Feedback:</h4>
                      <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    {assignment.status === "not_started" && (
                      <Button className="bg-gradient-cherry hover:opacity-90">
                        <Upload className="h-4 w-4 mr-2" />
                        Start Assignment
                      </Button>
                    )}
                    
                    {assignment.status === "overdue" && (
                      <Button variant="destructive">
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Late
                      </Button>
                    )}
                    
                    {(assignment.status === "graded" || assignment.status === "pending") && (
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Submission
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
