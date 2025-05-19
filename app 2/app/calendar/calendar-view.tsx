"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Task, BillPayment } from "@prisma/client";
import { Calendar as CalendarIcon, CheckSquare, CreditCard, ArrowLeft, ArrowRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

interface CalendarViewProps {
  initialTasks: Task[];
  initialBills: BillPayment[];
}

export default function CalendarView({ initialTasks, initialBills }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const getTasksForDate = (date: Date) => {
    return initialTasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };
  
  const getBillsForDate = (date: Date) => {
    return initialBills.filter(bill => 
      isSameDay(new Date(bill.dueDate), date)
    );
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };
  
  const tasksForSelectedDate = selectedDate ? getTasksForDate(selectedDate) : [];
  const billsForSelectedDate = selectedDate ? getBillsForDate(selectedDate) : [];
  const hasEvents = tasksForSelectedDate.length > 0 || billsForSelectedDate.length > 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <CalendarIcon className="mr-2 h-8 w-8 text-primary" />
            Calendar View
          </h1>
          <p className="text-muted-foreground">
            View your tasks and bills in a monthly calendar format
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">
                {format(currentDate, "MMMM yyyy")}
              </h2>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="h-24 md:h-32 p-1 bg-muted/30 rounded-md"></div>
              ))}
              
              {monthDays.map((day) => {
                const tasksForDay = getTasksForDate(day);
                const billsForDay = getBillsForDate(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentDate);
                
                return (
                  <motion.div
                    key={day.toString()}
                    whileHover={{ scale: 1.02 }}
                    className={`h-24 md:h-32 p-1 rounded-md border overflow-hidden transition-colors cursor-pointer ${
                      isToday 
                        ? "bg-primary/10 border-primary" 
                        : "bg-card hover:bg-accent/50"
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-medium text-sm p-1 rounded-full w-6 h-6 flex items-center justify-center ${
                        isToday ? "bg-primary text-primary-foreground" : ""
                      }`}>
                        {format(day, "d")}
                      </span>
                      
                      {(tasksForDay.length > 0 || billsForDay.length > 0) && (
                        <div className="flex space-x-1">
                          {tasksForDay.length > 0 && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">
                              <CheckSquare className="h-3 w-3 mr-1" /> {tasksForDay.length}
                            </Badge>
                          )}
                          {billsForDay.length > 0 && (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 text-xs">
                              <CreditCard className="h-3 w-3 mr-1" /> {billsForDay.length}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-1 space-y-1 overflow-hidden">
                      {tasksForDay.slice(0, 1).map((task) => (
                        <div 
                          key={task.id} 
                          className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 truncate"
                        >
                          {task.title}
                        </div>
                      ))}
                      
                      {billsForDay.slice(0, 1).map((bill) => (
                        <div 
                          key={bill.id} 
                          className="text-xs p-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 truncate"
                        >
                          {bill.title}
                        </div>
                      ))}
                      
                      {(tasksForDay.length + billsForDay.length > 2) && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{tasksForDay.length + billsForDay.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              
              {Array.from({ length: (7 - ((monthDays.length + monthStart.getDay()) % 7)) % 7 }).map((_, index) => (
                <div key={`empty-end-${index}`} className="h-24 md:h-32 p-1 bg-muted/30 rounded-md"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDate && (
            <Tabs defaultValue={tasksForSelectedDate.length > 0 ? "tasks" : "bills"}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="tasks" className="flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2" /> Tasks ({tasksForSelectedDate.length})
                </TabsTrigger>
                <TabsTrigger value="bills" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" /> Bills ({billsForSelectedDate.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="mt-4">
                {tasksForSelectedDate.length > 0 ? (
                  <div className="space-y-3">
                    {tasksForSelectedDate.map((task) => (
                      <div 
                        key={task.id} 
                        className={`p-3 rounded-md ${
                          task.completed 
                            ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500" 
                            : "bg-accent/50 border-l-4 border-blue-500"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </h3>
                          <Badge className={`${
                            task.priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                            task.priority === "medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
                            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          }`}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <span>{task.category}</span>
                          <span>{task.completed ? "Completed" : "Pending"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No tasks scheduled for this day</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="bills" className="mt-4">
                {billsForSelectedDate.length > 0 ? (
                  <div className="space-y-3">
                    {billsForSelectedDate.map((bill) => (
                      <div 
                        key={bill.id} 
                        className={`p-3 rounded-md ${
                          bill.isPaid 
                            ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500" 
                            : "bg-accent/50 border-l-4 border-amber-500"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${bill.isPaid ? "line-through text-muted-foreground" : ""}`}>
                            {bill.title}
                          </h3>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(bill.amount, bill.currency)}
                          </span>
                        </div>
                        {bill.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {bill.notes}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <span>{bill.category}</span>
                          <span>{bill.isPaid ? "Paid" : "Unpaid"}</span>
                        </div>
                        {bill.isRecurring && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Recurring ({bill.recurringType})
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No bills due on this day</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {selectedDate && !hasEvents && (
            <div className="text-center py-6 text-muted-foreground">
              <p>No tasks or bills scheduled for this day</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}