
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  ArrowLeft,
  Upload,
  Send
} from "lucide-react";

export default function StudentLessonDetail() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [taskSubmission, setTaskSubmission] = useState("");

  // Mock lesson data
  const lesson = {
    id: lessonId,
    title: "Lesson 8: Strategic Implementation",
    description: "Learn advanced strategic implementation techniques for maximum effectiveness.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "45 min",
    status: "unlocked",
    content: `
      This lesson covers the fundamental principles of strategic implementation.
      You'll learn how to apply advanced techniques in real-world scenarios.
      
      Key topics covered:
      • Strategic planning fundamentals
      • Implementation frameworks
      • Performance measurement
      • Risk assessment
    `,
    quiz: {
      question: "What is the most important factor in strategic implementation?",
      options: [
        "Clear communication",
        "Adequate resources",
        "Strong leadership",
        "All of the above"
      ],
      correctAnswer: 3
    },
    task: {
      title: "Strategic Analysis Task",
      description: "Analyze a given scenario and provide your strategic recommendations in 500+ words."
    }
  };

  const handleQuizSubmit = () => {
    console.log("Quiz submitted:", selectedAnswer);
    // Handle quiz submission logic
  };

  const handleTaskSubmit = () => {
    console.log("Task submitted:", taskSubmission);
    // Handle task submission logic
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" onClick={() => navigate("/student/courses")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gradient">{lesson.title}</h1>
          <p className="text-muted-foreground mt-1">{lesson.description}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Lesson Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <Play className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Video Player Placeholder</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{lesson.duration}</span>
                </div>
                <Badge variant="secondary">
                  {lesson.status === "unlocked" ? "Available" : "Locked"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Video Progress</span>
                    <span className="text-sm">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Quiz</span>
                    <Badge variant="outline">Not Started</Badge>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Task</span>
                    <Badge variant="outline">Not Started</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Lesson Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{lesson.content}</pre>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quiz Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="font-medium">{lesson.quiz.question}</p>
              
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                {lesson.quiz.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              
              <Button onClick={handleQuizSubmit} disabled={!selectedAnswer}>
                <Send className="h-4 w-4 mr-2" />
                Submit Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Task Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {lesson.task.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{lesson.task.description}</p>
              
              <Textarea
                placeholder="Enter your response here..."
                value={taskSubmission}
                onChange={(e) => setTaskSubmission(e.target.value)}
                rows={8}
              />
              
              <div className="flex items-center gap-2">
                <Button onClick={handleTaskSubmit}>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Task
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
