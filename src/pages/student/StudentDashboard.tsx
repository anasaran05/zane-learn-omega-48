
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, FileText, TrendingUp, MessageSquare, Calendar } from "lucide-react";
import { useStudentAnalytics, useStudentAchievements, useStudentCertificates, useStudentAssignments } from "@/hooks/useStudentPortalData";
import { StudentMentoringDashboard } from "@/components/mentoring/StudentMentoringDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentDashboard() {
  const { data: analytics } = useStudentAnalytics();
  const { data: achievements = [] } = useStudentAchievements();
  const { data: certificates = [] } = useStudentCertificates();
  const { data: assignments = [] } = useStudentAssignments();

  const recentAchievements = achievements.slice(0, 3);
  const pendingAssignments = assignments.filter(a => 
    !a.student_assignment_submissions?.length || 
    a.student_assignment_submissions[0]?.status === 'draft'
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mentoring">Mentoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totals.lessons_completed || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Keep up the great work!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totals.time_spent_hours || 0}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{achievements.length}</div>
                <p className="text-xs text-muted-foreground">
                  Unlocked achievements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{certificates.length}</div>
                <p className="text-xs text-muted-foreground">
                  Earned certificates
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.achievements.icon}</div>
                        <div>
                          <p className="font-medium">{achievement.achievements.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.achievements.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant={achievement.achievements.rarity === 'legendary' ? 'default' : 'secondary'}>
                        {achievement.achievements.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Assignments */}
          {pendingAssignments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pending Assignments
                </CardTitle>
                <CardDescription>Complete these assignments to continue your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </p>
                        {assignment.courses_enhanced?.title && (
                          <p className="text-sm text-blue-600">
                            {assignment.courses_enhanced.title}
                          </p>
                        )}
                      </div>
                      <Button size="sm">
                        Start Assignment
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mentoring">
          <StudentMentoringDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
