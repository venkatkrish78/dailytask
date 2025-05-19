import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
import DashboardContent from "@/components/dashboard-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch data for dashboard
  const tasksCount = await prisma.task.count();
  const completedTasksCount = await prisma.task.count({
    where: { completed: true },
  });
  const pendingTasksCount = tasksCount - completedTasksCount;
  
  const billsCount = await prisma.billPayment.count();
  const paidBillsCount = await prisma.billPayment.count({
    where: { isPaid: true },
  });
  const pendingBillsCount = billsCount - paidBillsCount;
  
  // Get upcoming tasks (due in the next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingTasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gte: today,
        lte: nextWeek,
      },
      completed: false,
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 5,
  });
  
  // Get upcoming bills (due in the next 30 days)
  const nextMonth = new Date(today);
  nextMonth.setDate(today.getDate() + 30);
  
  const upcomingBills = await prisma.billPayment.findMany({
    where: {
      dueDate: {
        gte: today,
        lte: nextMonth,
      },
      isPaid: false,
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 5,
  });
  
  // Calculate total pending bills amount
  const pendingBillsAmount = await prisma.billPayment.aggregate({
    where: { isPaid: false },
    _sum: {
      amount: true,
    },
  });
  
  const totalPendingAmount = pendingBillsAmount._sum.amount || 0;

  return (
    <DashboardContent 
      tasksCount={tasksCount}
      completedTasksCount={completedTasksCount}
      pendingTasksCount={pendingTasksCount}
      billsCount={billsCount}
      paidBillsCount={paidBillsCount}
      pendingBillsCount={pendingBillsCount}
      upcomingTasks={upcomingTasks}
      upcomingBills={upcomingBills}
      totalPendingAmount={totalPendingAmount}
    />
  );
}