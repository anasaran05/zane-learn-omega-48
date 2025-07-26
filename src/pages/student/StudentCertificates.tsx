
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Download, 
  Calendar, 
  CheckCircle,
  Clock
} from "lucide-react";

export default function StudentCertificates() {
  const [certificates] = useState([
    {
      id: 1,
      title: "Precision Training Certification",
      course: "Precision Training",
      completedDate: "2024-01-15",
      certificateId: "ZO-PT-2024-001",
      status: "earned",
      score: 92
    },
    {
      id: 2,
      title: "Foundation Course Certificate",
      course: "Foundation Course",
      completedDate: "2023-12-20",
      certificateId: "ZO-FC-2023-045",
      status: "earned",
      score: 85
    },
    {
      id: 3,
      title: "Advanced Techniques Certification",
      course: "Advanced Techniques",
      completedDate: null,
      certificateId: null,
      status: "in_progress",
      score: null,
      progress: 65
    },
    {
      id: 4,
      title: "Elite Certification",
      course: "Elite Certification Program",
      completedDate: null,
      certificateId: null,
      status: "not_started",
      score: null,
      progress: 0
    }
  ]);

  const handleDownload = (certificateId: string) => {
    console.log("Downloading certificate:", certificateId);
    // Handle certificate download logic
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "earned":
        return <Badge className="bg-green-500 hover:bg-green-600">Earned</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "not_started":
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const earnedCertificates = certificates.filter(cert => cert.status === "earned");
  const inProgressCertificates = certificates.filter(cert => cert.status === "in_progress");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">My Certificates</h1>
        <p className="text-muted-foreground">View and download your earned certificates</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Earned Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnedCertificates.length}</div>
            <p className="text-xs text-muted-foreground">Ready for download</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCertificates.length}</div>
            <p className="text-xs text-muted-foreground">Courses active</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(earnedCertificates.reduce((acc, cert) => acc + (cert.score || 0), 0) / earnedCertificates.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Earned Certificates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Earned Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {earnedCertificates.map((certificate) => (
            <Card key={certificate.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{certificate.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{certificate.course}</p>
                  </div>
                  {getStatusBadge(certificate.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Completed: {new Date(certificate.completedDate!).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Score: {certificate.score}%</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Certificate ID: {certificate.certificateId}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleDownload(certificate.certificateId!)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* In Progress */}
      {inProgressCertificates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Certificates in Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressCertificates.map((certificate) => (
              <Card key={certificate.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{certificate.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{certificate.course}</p>
                    </div>
                    {getStatusBadge(certificate.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm">{certificate.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-cherry h-2 rounded-full transition-all duration-300"
                          style={{ width: `${certificate.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Complete Course to Earn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
