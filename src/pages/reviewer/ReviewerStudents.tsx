
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Search, 
  User,
  BookOpen,
  TrendingUp,
  Mail,
  Eye
} from "lucide-react";

export default function ReviewerStudents() {
  const [searchTerm, setSearchTerm] = useState("");

  const students = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      enrolledCourses: 3,
      completedLessons: 12,
      totalLessons: 20,
      progress: 60,
      status: "active",
      lastActivity: "2 hours ago",
      pendingReviews: 2
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      enrolledCourses: 2,
      completedLessons: 8,
      totalLessons: 15,
      progress: 53,
      status: "active",
      lastActivity: "1 day ago",
      pendingReviews: 1
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.w@email.com",
      enrolledCourses: 4,
      completedLessons: 25,
      totalLessons: 30,
      progress: 83,
      status: "active",
      lastActivity: "3 hours ago",
      pendingReviews: 0
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.d@email.com",
      enrolledCourses: 1,
      completedLessons: 3,
      totalLessons: 10,
      progress: 30,
      status: "inactive",
      lastActivity: "1 week ago",
      pendingReviews: 3
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Assigned Students</h1>
        <p className="text-muted-foreground">Monitor and track your assigned students' progress</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative max-w-md"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      {/* Students List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredStudents.map((student) => (
          <Card key={student.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-cherry rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{student.email}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(student.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{student.enrolledCourses}</p>
                      <p className="text-xs text-muted-foreground">Enrolled Courses</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{student.completedLessons}/{student.totalLessons}</p>
                      <p className="text-xs text-muted-foreground">Lessons</p>
                    </div>
                  </div>
                </div>

                {/* Activity & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Last activity: {student.lastActivity}</p>
                    {student.pendingReviews > 0 && (
                      <p className="text-sm text-orange-500">
                        {student.pendingReviews} pending review{student.pendingReviews > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  <Button size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {filteredStudents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No students found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms." : "No students are currently assigned to you."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
