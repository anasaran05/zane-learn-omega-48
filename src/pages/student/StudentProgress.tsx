
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  BookOpen, 
  Clock, 
  Target,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle
} from "lucide-react";
import { useStudentProgressStats, useStudentProgress } from "@/hooks/useStudentData";

export default function StudentProgress() {
  const { data: stats, isLoading: statsLoading } = useStudentProgressStats();
  const { data: progressData, isLoading: progressLoading } = useStudentProgress();

  if (statsLoading || progressLoading) {
    return <div>Loading progress...</div>;
  }

  const overallStats = stats || {
    coursesCompleted: 0,
    coursesInProgress: 0,
    totalHoursLearned: 0,
    averageScore: 0,
    streak: 0
  };

  // Process course progress from enrollments
  const courseProgress = stats?.enrollments?.map(enrollment => {
    const lessonsCompleted = progressData?.filter(p => 
      p.course_id === enrollment.course_id && p.is_completed
    ).length || 0;
    
    const totalLessons = 10; // This should come from course_lessons count
    const progress = Math.round((enrollment.progress_percentage || 0));
    
    return {
      title: enrollment.courses_enhanced?.title || 'Unknown Course',
      progress,
      score: 87, // This should come from quiz scores
      lessonsCompleted,
      totalLessons,
      lastActivity: enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : 'Unknown'
    };
  }) || [];

  const achievements = [
    { title: "First Course Completed", icon: Trophy, unlocked: true },
    { title: "Perfect Score", icon: Award, unlocked: true },
    { title: "Learning Streak", icon: Target, unlocked: true },
    { title: "Advanced Learner", icon: BookOpen, unlocked: false },
    { title: "Elite Status", icon: CheckCircle, unlocked: false }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Learning Progress</h1>
        <p className="text-muted-foreground">Track your journey to mastery</p>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.coursesCompleted}</div>
            <p className="text-xs text-muted-foreground">Courses</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cherry-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.coursesInProgress}</div>
            <p className="text-xs text-muted-foreground">Courses</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Hours Learned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalHoursLearned}</div>
            <p className="text-xs text-muted-foreground">Total time</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Avg Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Performance</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.streak}</div>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseProgress.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{course.title}</h3>
                      <Badge variant={course.progress === 100 ? "default" : "secondary"}>
                        {course.score}%
                      </Badge>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{course.lessonsCompleted}/{course.totalLessons} lessons</span>
                      <span>{course.lastActivity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${achievement.unlocked ? 'bg-muted/50' : 'bg-muted/20 opacity-60'}`}>
                    <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <Badge variant={achievement.unlocked ? "default" : "secondary"} className="text-xs">
                        {achievement.unlocked ? "Unlocked" : "Locked"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
