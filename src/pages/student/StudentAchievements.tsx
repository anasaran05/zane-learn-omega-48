
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  BookOpen, 
  CheckCircle,
  Zap,
  Crown,
  Medal
} from "lucide-react";

export default function StudentAchievements() {
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first lesson",
      icon: BookOpen,
      unlocked: true,
      unlockedDate: "2024-01-15",
      rarity: "common"
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Score 100% on any quiz",
      icon: Star,
      unlocked: true,
      unlockedDate: "2024-01-18",
      rarity: "rare"
    },
    {
      id: 3,
      title: "Course Master",
      description: "Complete your first full course",
      icon: Trophy,
      unlocked: true,
      unlockedDate: "2024-01-22",
      rarity: "epic"
    },
    {
      id: 4,
      title: "Learning Streak",
      description: "Learn for 7 consecutive days",
      icon: Target,
      unlocked: true,
      unlockedDate: "2024-01-25",
      rarity: "rare"
    },
    {
      id: 5,
      title: "Elite Student",
      description: "Complete 3 courses with 90+ average",
      icon: Crown,
      unlocked: false,
      progress: 66,
      rarity: "legendary"
    },
    {
      id: 6,
      title: "Speed Learner",
      description: "Complete a lesson in under 10 minutes",
      icon: Zap,
      unlocked: false,
      progress: 0,
      rarity: "rare"
    },
    {
      id: 7,
      title: "Dedication",
      description: "Learn for 30 consecutive days",
      icon: Medal,
      unlocked: false,
      progress: 40,
      rarity: "epic"
    },
    {
      id: 8,
      title: "Knowledge Seeker",
      description: "Complete 10 courses",
      icon: Award,
      unlocked: false,
      progress: 20,
      rarity: "legendary"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-500 bg-gray-100";
      case "rare": return "text-blue-500 bg-blue-100";
      case "epic": return "text-purple-500 bg-purple-100";
      case "legendary": return "text-yellow-500 bg-yellow-100";
      default: return "text-gray-500 bg-gray-100";
    }
  };

  const getIconColor = (rarity: string, unlocked: boolean) => {
    if (!unlocked) return "text-muted-foreground";
    
    switch (rarity) {
      case "common": return "text-gray-500";
      case "rare": return "text-blue-500";
      case "epic": return "text-purple-500";
      case "legendary": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Achievements</h1>
        <p className="text-muted-foreground">Celebrate your learning milestones and unlock new goals</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-cherry-500" />
              <div>
                <div className="text-2xl font-bold">{lockedAchievements.length}</div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</div>
                <p className="text-sm text-muted-foreground">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{unlockedAchievements.filter(a => a.rarity === "legendary").length}</div>
                <p className="text-sm text-muted-foreground">Legendary</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Unlocked Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="card-hover bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <achievement.icon className={`h-8 w-8 ${getIconColor(achievement.rarity, true)}`} />
                      <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Unlocked on {achievement.unlockedDate}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">In Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="card-hover opacity-75 hover:opacity-90">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <achievement.icon className={`h-8 w-8 ${getIconColor(achievement.rarity, false)}`} />
                      <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    {achievement.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
