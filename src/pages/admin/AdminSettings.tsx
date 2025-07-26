
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  Users, 
  Bell, 
  Shield, 
  Mail,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Save
} from "lucide-react";

export default function AdminSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoAssignReviews, setAutoAssignReviews] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Mock data - would come from API
  const reviewers = [
    {
      id: 1,
      name: "Dr. Sarah Smith",
      email: "sarah.smith@zaneomega.com",
      specialties: ["Advanced Techniques", "Strategic Methods"],
      activeReviews: 12,
      status: "Active"
    },
    {
      id: 2,
      name: "Prof. John Doe",
      email: "john.doe@zaneomega.com",
      specialties: ["Elite Certification"],
      activeReviews: 8,
      status: "Active"
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      email: "michael.chen@zaneomega.com",
      specialties: ["Precision Training", "Analytics"],
      activeReviews: 5,
      status: "Inactive"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "System Maintenance Scheduled",
      message: "Planned maintenance on Sunday, 2 AM - 4 AM EST",
      createdAt: "2024-01-20",
      active: true
    },
    {
      id: 2,
      title: "New Course Launch",
      message: "Advanced Strategic Implementation course now available",
      createdAt: "2024-01-18",
      active: true
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">System Settings</h1>
        <p className="text-muted-foreground">Manage platform configuration and user permissions</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Zane Ωmega Learning Management System" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input id="admin-email" type="email" defaultValue="admin@zaneomega.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@zaneomega.com" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send system notifications via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Assign Reviews</Label>
                  <p className="text-sm text-muted-foreground">Automatically assign submissions to reviewers</p>
                </div>
                <Switch 
                  checked={autoAssignReviews} 
                  onCheckedChange={setAutoAssignReviews} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
                </div>
                <Switch 
                  checked={maintenanceMode} 
                  onCheckedChange={setMaintenanceMode} 
                />
              </div>
              
              <Button className="w-full bg-gradient-cherry hover:opacity-90">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input id="announcement-title" placeholder="Enter announcement title" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="announcement-message">Message</Label>
                  <Textarea id="announcement-message" placeholder="Enter announcement message" />
                </div>
                
                <Button size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Announcement
                </Button>
                
                <div className="space-y-3 pt-4 border-t">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm">{announcement.title}</h4>
                          <p className="text-xs text-muted-foreground">{announcement.message}</p>
                          <p className="text-xs text-muted-foreground">{announcement.createdAt}</p>
                        </div>
                        <Badge variant={announcement.active ? "default" : "secondary"}>
                          {announcement.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Reviewer Management
              </CardTitle>
              <Button size="sm" className="bg-gradient-cherry hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Reviewer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Active Reviews</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewers.map((reviewer) => (
                  <TableRow key={reviewer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reviewer.name}</div>
                        <div className="text-sm text-muted-foreground">{reviewer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {reviewer.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{reviewer.activeReviews}</TableCell>
                    <TableCell>
                      <Badge variant={reviewer.status === "Active" ? "default" : "secondary"}>
                        {reviewer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
