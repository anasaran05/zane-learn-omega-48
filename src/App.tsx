
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import { AdminLayout } from "./components/layout/AdminLayout";
import { StudentLayout } from "./components/layout/StudentLayout";
import { ReviewerLayout } from "./components/layout/ReviewerLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import CourseDetail from "./pages/admin/CourseDetail";
import CourseEdit from "./pages/admin/CourseEdit";
import CourseCreate from "./pages/admin/CourseCreate";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentProgress from "./pages/student/StudentProgress";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentAchievements from "./pages/student/StudentAchievements";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSettings from "./pages/student/StudentSettings";
import StudentSupport from "./pages/student/StudentSupport";
import StudentLessonDetail from "./pages/student/StudentLessonDetail";
import StudentLessonView from "./pages/student/StudentLessonView";

// Reviewer Pages
import ReviewerDashboard from "./pages/reviewer/ReviewerDashboard";
import ReviewerReviews from "./pages/reviewer/ReviewerReviews";
import ReviewerReviewDetail from "./pages/reviewer/ReviewerReviewDetail";
import ReviewerStudents from "./pages/reviewer/ReviewerStudents";
import ReviewerProfile from "./pages/reviewer/ReviewerProfile";
import ReviewerSettings from "./pages/reviewer/ReviewerSettings";
import ReviewerSupport from "./pages/reviewer/ReviewerSupport";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminLayout>
                    <Navigate to="/admin/dashboard" replace />
                  </AdminLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminLayout>
                    <AdminCourses />
                  </AdminLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/courses/:id" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminLayout>
                    <CourseDetail />
                  </AdminLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/courses/:id/edit" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <CourseEdit />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/courses/create" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminLayout>
                    <CourseCreate />
                  </AdminLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/students" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminLayout>
                    <AdminStudents />
                  </AdminLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/reviews" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminLayout>
                    <AdminReviews />
                  </AdminLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminLayout>
                    <AdminAnalytics />
                  </AdminLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <Navigate to="/student/dashboard" replace />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/dashboard" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentDashboard />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/courses" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentCourses />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/progress" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentProgress />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/assignments" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentAssignments />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/achievements" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentAchievements />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/certificates" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentCertificates />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/lesson/:id" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentLessonDetail />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/courses/:courseId/lessons/:lessonId" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLessonView />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentProfile />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/settings" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentSettings />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/student/support" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <StudentSupport />
                  </StudentLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />

            {/* Reviewer Routes */}
            <Route path="/reviewer" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerLayout>
                    <Navigate to="/reviewer/dashboard" replace />
                  </ReviewerLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/reviewer/dashboard" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerLayout>
                    <ReviewerDashboard />
                  </ReviewerLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/reviewer/reviews" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerLayout>
                    <ReviewerReviews />
                  </ReviewerLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/reviewer/reviews/:id" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerLayout>
                    <ReviewerReviewDetail />
                  </ReviewerLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/reviewer/students" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerLayout>
                    <ReviewerStudents />
                  </ReviewerLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/reviewer/profile" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerLayout>
                    <ReviewerProfile />
                  </ReviewerLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/reviewer/settings" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerLayout>
                    <ReviewerSettings />
                  </ReviewerLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/reviewer/support" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerLayout>
                    <ReviewerSupport />
                  </ReviewerLayout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
