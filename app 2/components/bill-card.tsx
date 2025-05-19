"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  Calendar, 
  DollarSign, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Tag
} from "lucide-react";
import { BillPayment } from "@prisma/client";
import { cn, formatDate, formatCurrency, getCategoryColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BillCardProps {
  bill: BillPayment;
  onEdit: (bill: BillPayment) => void;
}

export default function BillCard({ bill, onEdit }: BillCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/bills/${bill.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bill");
      }

      toast.success("Bill deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast.error("Failed to delete bill");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePaid = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/bills/${bill.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPaid: !bill.isPaid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bill");
      }

      toast.success(
        bill.isPaid ? "Bill marked as unpaid" : "Bill marked as paid!"
      );
      router.refresh();
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error("Failed to update bill status");
    } finally {
      setIsUpdating(false);
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

  const isOverdue = !bill.isPaid && new Date(bill.dueDate) < new Date();

  // Format recurring type with a fallback for undefined
  const formatRecurringType = (type: string | null) => {
    if (!type) return "Recurring";
    return type.charAt(0).toUpperCase() + type.slice(1);
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
        bill.isPaid ? "border-l-green-500 bg-green-50/30 dark:bg-green-900/10" : 
          isOverdue ? "border-l-red-500" : "border-l-amber-500"
      )}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={bill.isPaid}
                onCheckedChange={handleTogglePaid}
                disabled={isUpdating}
                className="h-5 w-5"
              />
              <h3 className={cn(
                "text-lg font-medium transition-all duration-300",
                bill.isPaid && "task-completed"
              )}>
                {bill.title}
              </h3>
            </div>
            <Badge className={getCategoryColor(bill.category)}>
              <Tag className="h-3 w-3 mr-1" />
              {bill.category.charAt(0).toUpperCase() + bill.category.slice(1)}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-5 w-5 mr-1" />
              <span>{formatCurrency(bill.amount, bill.currency)}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Due: {formatDate(bill.dueDate)}</span>
            </div>
            
            {bill.isRecurring && (
              <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <RefreshCw className="h-3 w-3" />
                {formatRecurringType(bill.recurringType)}
              </Badge>
            )}
          </div>
          
          {bill.notes && (
            <p className={cn(
              "text-sm text-muted-foreground mt-3",
              bill.isPaid && "task-completed"
            )}>
              {bill.notes}
            </p>
          )}
          
          <div className="flex justify-between mt-4 pt-3 border-t border-border">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(bill)}
              className="text-xs"
            >
              <Edit className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTogglePaid}
                disabled={isUpdating}
                className={cn(
                  "text-xs",
                  bill.isPaid ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"
                )}
              >
                {bill.isPaid ? (
                  <>
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Mark Unpaid
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Mark Paid
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