"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Tag
} from "lucide-react";
import { Task } from "@prisma/client";
import { cn, formatDate, getPriorityColor, getCategoryColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      toast.success("Task deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      setIsCompleting(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      toast.success(
        task.completed ? "Task marked as incomplete" : "Task completed!"
      );
      router.refresh();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task status");
    } finally {
      setIsCompleting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { 
      scale: 1.02, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="h-full"
    >
      <Card className={cn(
        "h-full overflow-hidden transition-all duration-300 border-l-4",
        task.completed ? "border-l-green-500 bg-green-50/30 dark:bg-green-900/10" : 
          task.priority === "high" ? "border-l-red-500" :
          task.priority === "medium" ? "border-l-amber-500" : "border-l-blue-500"
      )}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={handleToggleComplete}
                disabled={isCompleting}
                className="h-5 w-5"
              />
              <h3 className={cn(
                "text-lg font-medium transition-all duration-300",
                task.completed && "task-completed"
              )}>
                {task.title}
              </h3>
            </div>
            <Badge className={getCategoryColor(task.category)}>
              <Tag className="h-3 w-3 mr-1" />
              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </Badge>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-sm text-muted-foreground mb-3",
              task.completed && "task-completed"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            {task.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            
            <div className={cn(
              "flex items-center text-xs",
              getPriorityColor(task.priority)
            )}>
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              <span>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>
            </div>
          </div>
          
          <div className="flex justify-between mt-4 pt-3 border-t border-border">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(task)}
              className="text-xs"
            >
              <Edit className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleToggleComplete}
                disabled={isCompleting}
                className={cn(
                  "text-xs",
                  task.completed ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"
                )}
              >
                {task.completed ? (
                  <>
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Undo
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Complete
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}