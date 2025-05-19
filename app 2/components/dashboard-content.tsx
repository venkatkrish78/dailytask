"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate, formatCurrency } from "@/lib/utils";
import { 
  CheckSquare, 
  Calendar, 
  CreditCard, 
  ArrowRight, 
  Clock,
  CheckCircle,
  AlertTriangle,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, BillPayment } from "@prisma/client";

interface DashboardContentProps {
  tasksCount: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  billsCount: number;
  paidBillsCount: number;
  pendingBillsCount: number;
  upcomingTasks: Task[];
  upcomingBills: BillPayment[];
  totalPendingAmount: number;
}

export default function DashboardContent({
  tasksCount,
  completedTasksCount,
  pendingTasksCount,
  billsCount,
  paidBillsCount,
  pendingBillsCount,
  upcomingTasks,
  upcomingBills,
  totalPendingAmount
}: DashboardContentProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to <span className="text-primary">TaskMaster</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your personal and professional tasks efficiently with our simple yet powerful task manager.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        <motion.div variants={item}>
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center">
                <CheckSquare className="mr-2 h-6 w-6 text-primary" />
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tasksCount}</div>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="mr-1 h-3 w-3" /> {completedTasksCount} Completed
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                  <Clock className="mr-1 h-3 w-3" /> {pendingTasksCount} Pending
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/tasks">
                  View All Tasks <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center">
                <CreditCard className="mr-2 h-6 w-6 text-primary" />
                Bills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{billsCount}</div>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="mr-1 h-3 w-3" /> {paidBillsCount} Paid
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                  <AlertTriangle className="mr-1 h-3 w-3" /> {pendingBillsCount} Pending
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/bills">
                  Manage Bills <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-primary" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {upcomingTasks.length + upcomingBills.length}
              </div>
              <p className="text-muted-foreground">Upcoming events</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/calendar">
                  View Calendar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="card-hover bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center">
                <CreditCard className="mr-2 h-6 w-6 text-primary" />
                Pending Bills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(totalPendingAmount, "INR")}
              </div>
              <p className="text-muted-foreground">Total amount due</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/bills">
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <CheckSquare className="mr-2 h-5 w-5 text-primary" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>Tasks due in the next 7 days</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/tasks">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <motion.li
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 rounded-md bg-accent/50"
                    >
                      <div className="flex items-start">
                        <div className={`h-2 w-2 mt-2 rounded-full ${
                          task.priority === "high" ? "bg-red-500" : 
                          task.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                        }`} />
                        <div className="ml-3">
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(task.dueDate)}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${
                        task.category === "personal" ? 
                        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" : 
                        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      }`}>
                        {task.category}
                      </Badge>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
                  <p>No upcoming tasks for the next 7 days</p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/tasks">
                      <PlusCircle className="h-4 w-4 mr-1" /> Add New Task
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-primary" />
                  Upcoming Bills
                </CardTitle>
                <CardDescription>Bills due in the next 30 days</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/bills">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingBills.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingBills.map((bill) => (
                    <motion.li
                      key={bill.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 rounded-md bg-accent/50"
                    >
                      <div className="flex items-start">
                        <div className="ml-0">
                          <h4 className="font-medium">{bill.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(bill.dueDate)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(bill.amount, bill.currency)}
                        </div>
                        <Badge className="mt-1 text-xs">
                          {bill.category}
                        </Badge>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
                  <p>No upcoming bills for the next 30 days</p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/bills">
                      <PlusCircle className="h-4 w-4 mr-1" /> Add New Bill
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}