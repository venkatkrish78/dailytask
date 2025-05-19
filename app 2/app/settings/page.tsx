"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Clock, 
  Trash2,
  AlertTriangle,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState("1day");
  const [enableReminders, setEnableReminders] = useState(true);
  const [enableSounds, setEnableSounds] = useState(true);
  const [defaultTaskPriority, setDefaultTaskPriority] = useState("medium");
  const [defaultTaskCategory, setDefaultTaskCategory] = useState("personal");
  
  const handleClearData = () => {
    setIsConfirmDialogOpen(false);
    // This would actually clear data in a real app
    setTimeout(() => {
      toast.success("All data has been cleared successfully");
    }, 1000);
  };
  
  const handleSaveSettings = () => {
    // This would save settings in a real app
    toast.success("Settings saved successfully");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Settings className="mr-2 h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your TaskMaster experience
          </p>
        </div>
      </motion.div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sun className="mr-2 h-5 w-5 text-primary" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how TaskMaster looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={theme === "light" ? "default" : "outline"} 
                        className="flex items-center justify-center"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-5 w-5 mr-2" />
                        Light
                      </Button>
                      <Button 
                        variant={theme === "dark" ? "default" : "outline"} 
                        className="flex items-center justify-center"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-5 w-5 mr-2" />
                        Dark
                      </Button>
                      <Button 
                        variant={theme === "system" ? "default" : "outline"} 
                        className="flex items-center justify-center"
                        onClick={() => setTheme("system")}
                      >
                        <Monitor className="h-5 w-5 mr-2" />
                        System
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-primary" />
                    Task Defaults
                  </CardTitle>
                  <CardDescription>
                    Set default values for new tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Priority</Label>
                    <Select value={defaultTaskPriority} onValueChange={setDefaultTaskPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Default Category</Label>
                    <Select value={defaultTaskCategory} onValueChange={setDefaultTaskCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="official">Official</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-primary" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders for upcoming tasks and bills
                    </p>
                  </div>
                  <Switch 
                    checked={enableReminders}
                    onCheckedChange={setEnableReminders}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notification Sounds</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for notifications and alerts
                    </p>
                  </div>
                  <Switch 
                    checked={enableSounds}
                    onCheckedChange={setEnableSounds}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Default Reminder Time</Label>
                  <Select value={reminderTime} onValueChange={setReminderTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 minutes before</SelectItem>
                      <SelectItem value="1hour">1 hour before</SelectItem>
                      <SelectItem value="3hours">3 hours before</SelectItem>
                      <SelectItem value="1day">1 day before</SelectItem>
                      <SelectItem value="2days">2 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="data">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-500 dark:text-red-400">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Manage your application data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 dark:border-red-900 rounded-md bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800 dark:text-red-300">Danger Zone</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        The following actions are destructive and cannot be undone. Please proceed with caution.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h4 className="font-medium">Clear All Data</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Delete all tasks, bills, and settings. This action cannot be undone.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIsConfirmDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500 dark:text-red-400">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Confirm Data Deletion
            </DialogTitle>
            <DialogDescription>
              This action will permanently delete all your tasks, bills, and settings. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border border-red-200 dark:border-red-900 rounded-md bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-sm">
            Are you absolutely sure you want to delete all your data? This action is permanent and cannot be recovered.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearData}>
              Yes, Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}