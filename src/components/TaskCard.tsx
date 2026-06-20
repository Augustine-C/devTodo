import { Check, Calendar, Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import type { Task } from "../types";
import { useStore } from "../store";

interface TaskCardProps {
  task: Task;
  showDate?: boolean;
}

const PRIORITY_DOT: Record<string, string> = {
  low: "bg-blue-400",
  medium: "bg-amber-400",
  high: "bg-red-400",
};

export function TaskCard({ task, showDate = false }: TaskCardProps) {
  const { projects, categories, markDone, markTodo, removeTask, openTaskForm } = useStore();
  const project = projects.find((p) => p.id === task.project_id);
  const category = categories.find((c) => c.id === task.category_id);
  const isDone = task.status === "done";

  return (
    <div className={cn(
      "group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors",
      isDone && "opacity-60"
    )}>
      <button
        onClick={() => isDone ? markTodo(task.id) : markDone(task.id)}
        className={cn(
          "mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
          isDone
            ? "bg-gray-400 border-gray-400"
            : "border-gray-300 hover:border-gray-500 bg-white"
        )}
      >
        {isDone && <Check size={10} strokeWidth={3} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn(
            "text-sm text-gray-800 leading-snug",
            isDone && "line-through text-gray-500"
          )}>
            {task.title}
          </span>
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", PRIORITY_DOT[task.priority])} />
        </div>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {project && (
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: project.color + "20", color: project.color }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </span>
          )}
          {category && (
            <span
              className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: category.color + "18", color: category.color }}
            >
              {category.name}
            </span>
          )}
          {showDate && task.due_date && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={10} />
              {format(new Date(task.due_date), "MMM d")}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-gray-300">
            <Clock size={10} />
            {format(new Date(task.created_at), "MMM d, yyyy")}
          </span>
        </div>
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all">
            <MoreHorizontal size={14} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-32 bg-white rounded-lg shadow-lg border border-gray-200 p-1 text-sm"
            align="end"
            sideOffset={4}
          >
            <DropdownMenu.Item
              className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100 outline-none"
              onSelect={() => openTaskForm(task)}
            >
              <Pencil size={13} /> Edit
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-red-600 hover:bg-red-50 outline-none"
              onSelect={() => removeTask(task.id)}
            >
              <Trash2 size={13} /> Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
