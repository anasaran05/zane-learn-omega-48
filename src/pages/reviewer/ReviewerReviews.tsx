
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Clock,
  User,
  BookOpen,
  AlertCircle
} from "lucide-react";

export default function ReviewerReviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const submissions = [
    {
      id: 1,
      studentId: "student-1",
      studentName: "John Smith",
      studentEmail: "john.smith@email.com",
      courseId: "course-1",
      courseName: "Advanced Techniques",
      lessonId: "lesson-8",
      lessonTitle: "Strategic Implementation",
      submissionType: "task",
      submittedAt: "2024-01-26T14:30:00Z",
      status: "pending",
      priority: "high",
      content: "Here is my analysis of the strategic implementation framework..."
    },
    {
      id: 2,
      studentId: "student-2",
      studentName: "Sarah Johnson",
      studentEmail: "sarah.j@email.com",
      courseId: "course-2",
      courseName: "Precision Training",
      lessonId: "lesson-5",
      lessonTitle: "Advanced Methods",
      submissionType: "quiz",
      submittedAt: "2024-01-26T12:15:00Z",
      status: "pending",
      priority: "medium",
      score: 85,
      answers: ["A", "C", "B", "D"]
    },
    {
      id: 3,
      studentId: "student-3",
      studentName: "Mike Wilson",
      studentEmail: "mike.w@email.com",
      courseId: "course-1",
      courseName: "Advanced Techniques",
      lessonId: "lesson-7",
      lessonTitle: "Advanced Strategies",
      submissionType: "task",
      submittedAt: "2024-01-25T16:45:00Z",
      status: "reviewed",
      priority: "low",
      reviewScore: 92,
      reviewFeedback: "Excellent work! Great understanding of the concepts."
    },
    {
      id: 4,
      studentId: "student-4",
      studentName: "Emma Davis",
      studentEmail: "emma.d@email.com",
      courseId: "course-3",
      courseName: "Foundation Course",
      lessonId: "lesson-3",
      lessonTitle: "Basic Principles",
      submissionType: "task",
      submittedAt: "2024-01-25T10:20:00Z",
      status: "pending",
      priority: "high",
      content: "My understanding of the basic principles is as follows..."
    }
  ];

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || submission.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case "reviewed":
        return <Badge className="bg-green-500 hover:bg-green-600">Reviewed</Badge>;
      case "in_review":
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>;
      case "medium":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSubmissionTypeIcon = (type: string) => {
    switch (type) {
      case "task":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatSubmissionTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Review Submissions</h1>
        <p className="text-muted-foreground">Review and provide feedback on student submissions</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
      </motion.div>

      {/* Submissions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getSubmissionTypeIcon(submission.submissionType)}
                  <div>
                    <CardTitle className="text-lg">{submission.lessonTitle}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{submission.submissionType}</Badge>
                      <span className="text-sm text-muted-foreground">{submission.courseName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(submission.priority)}
                  {getStatusBadge(submission.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{submission.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatSubmissionTime(submission.submittedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{submission.courseName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {submission.status === "reviewed" && submission.reviewScore && (
                      <Badge variant="secondary">Score: {submission.reviewScore}%</Badge>
                    )}
                    <Button size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>

                {submission.submissionType === "task" && submission.content && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Submission Preview:</p>
                    <p className="text-sm line-clamp-2">{submission.content}</p>
                  </div>
                )}

                {submission.submissionType === "quiz" && submission.score && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Quiz Score:</p>
                    <p className="text-sm font-medium">{submission.score}% ({submission.answers?.join(", ")})</p>
                  </div>
                )}

                {submission.status === "reviewed" && submission.reviewFeedback && (
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-muted-foreground mb-1">Your Feedback:</p>
                    <p className="text-sm">{submission.reviewFeedback}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSubmissions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No submissions found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search terms or filters."
                  : "No submissions are currently assigned to you."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
