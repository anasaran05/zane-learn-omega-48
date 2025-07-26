
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  LogOut,
  Shield,
  Trash2,
  Loader2
} from "lucide-react";
import { useStudentSettings } from "@/hooks/useStudentSettings";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function StudentSettings() {
  const { signOut } = useAuth();
  const { settings, isLoading, updateSettings, isUpdating } = useStudentSettings();

  const handleSettingChange = (key: string, value: boolean) => {
    if (!settings) return;
    
    console.log(`Setting ${key} changed to:`, value);
    updateSettings({ [key]: value });
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await signOut();
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Account deletion requested");
      toast.error("Account deletion is not yet implemented. Please contact support.");
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This will remove all completed lessons and scores.")) {
      console.log("Progress reset requested");
      toast.error("Progress reset is not yet implemented. Please contact support.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <div className="text-lg">Loading your settings...</div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Failed to load settings. Please refresh the page.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {settings.dark_mode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.dark_mode}
                    onCheckedChange={(checked) => handleSettingChange('dark_mode', checked)}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your courses via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                    disabled={isUpdating}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
                    disabled={isUpdating}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and updates
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={settings.marketing_emails}
                    onCheckedChange={(checked) => handleSettingChange('marketing_emails', checked)}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Learning Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoplay">Autoplay Videos</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically play the next video in sequence
                    </p>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={settings.autoplay_videos}
                    onCheckedChange={(checked) => handleSettingChange('autoplay_videos', checked)}
                    disabled={isUpdating}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-enabled">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound effects for interactions and notifications
                    </p>
                  </div>
                  <Switch
                    id="sound-enabled"
                    checked={settings.sound_effects}
                    onCheckedChange={(checked) => handleSettingChange('sound_effects', checked)}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Session Management</h4>
                  <Button onClick={handleLogout} className="w-full" variant="outline">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Data Management</h4>
                  <Button onClick={handleResetProgress} className="w-full" variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset Learning Progress
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button 
                onClick={handleDeleteAccount} 
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
