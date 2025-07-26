import { motion } from "framer-motion";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock,
  FileText,
  AlertCircle
} from "lucide-react";
import { useAdminDashboardStats, useRecentActivity, useQuickActionsData } from "@/hooks/useAdminDashboard";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const { data: quickActions, isLoading: actionsLoading } = useQuickActionsData();

  if (statsLoading || activityLoading || actionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      description: "Active learners",
      icon: Users,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Published Courses",
      value: stats?.publishedCourses || 0,
      description: `${stats?.totalCourses || 0} total courses`,
      icon: BookOpen,
      trend: { value: 2, isPositive: true }
    },
    {
      title: "Completion Rate",
      value: `${stats?.completionRate || 0}%`,
      description: "Average completion",
      icon: TrendingUp,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Avg Review Time",
      value: `${stats?.avgReviewTime || 0} days`,
      description: "Review turnaround",
      icon: Clock,
      trend: { value: 8, isPositive: false }
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'pending-reviews':
        navigate('/admin/reviews');
        break;
      case 'new-submissions':
        navigate('/admin/reviews');
        break;
      case 'course-updates':
        navigate('/admin/courses');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your training platform performance</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.course}</p>
                        {activity.student && (
                          <p className="text-xs text-muted-foreground">{activity.student}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.timeAgo}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent activity</p>
                    <p className="text-sm">Activity will appear here as users interact with courses</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
                  onClick={() => handleQuickAction('pending-reviews')}
                >
                  <span>Pending Reviews</span>
                  <span className="bg-cherry-500 text-white px-2 py-1 rounded-full text-xs">
                    {quickActions?.pendingReviews || 0}
                  </span>
                </div>
                <div 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
                  onClick={() => handleQuickAction('new-submissions')}
                >
                  <span>New Submissions</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                    {quickActions?.newSubmissions || 0}
                  </span>
                </div>
                <div 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors"
                  onClick={() => handleQuickAction('course-updates')}
                >
                  <span>Course Updates</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    {quickActions?.courseUpdates || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
