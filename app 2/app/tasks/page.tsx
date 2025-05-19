import { prisma } from "@/lib/prisma";
import TaskList from "./task-list";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: [
      { completed: "asc" },
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskList initialTasks={tasks} />
    </div>
  );
}