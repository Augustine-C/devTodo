import { Plus } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { TaskCard } from "../components/TaskCard";
import { useStore } from "../store";
import { useT, useDateLocale } from "../i18n";
import { cn } from "../lib/utils";
import type { Task } from "../types";

export function WeeklyView() {
  const { tasks, currentDate, selectedProjectId, selectedCategoryId, openTaskForm } = useStore();
  const t = useT();
  const dateLocale = useDateLocale();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const filtered = tasks.filter((task) => {
    if (selectedProjectId && task.project_id !== selectedProjectId) return false;
    if (selectedCategoryId && task.category_id !== selectedCategoryId) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <div className="min-w-[700px] h-full flex flex-col px-4 py-4">
        <div className="text-sm text-gray-400 mb-3 px-1">
          {t.weekOfLabel(
            format(weekStart, "MMM d", { locale: dateLocale }),
            format(weekEnd, "MMM d, yyyy", { locale: dateLocale })
          )}
        </div>
        <div className="grid grid-cols-7 gap-2 flex-1">
          {days.map((day) => {
            const dayTasks = filtered.filter((task) =>
              task.due_date !== null && isSameDay(new Date(task.due_date), day)
            );
            return (
              <DayColumn
                key={day.toISOString()}
                day={day}
                tasks={dayTasks}
                onAddTask={() => openTaskForm(undefined, day.getTime())}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayColumn({ day, tasks, onAddTask }: {
  day: Date;
  tasks: Task[];
  onAddTask: () => void;
}) {
  const today = isToday(day);
  const dateLocale = useDateLocale();

  return (
    <div className={cn(
      "flex flex-col rounded-xl border",
      today ? "border-blue-200 bg-blue-50/40" : "border-gray-100 bg-white"
    )}>
      <div className={cn(
        "px-2.5 py-2 border-b text-center",
        today ? "border-blue-100" : "border-gray-100"
      )}>
        <p className="text-xs text-gray-400">{format(day, "EEE", { locale: dateLocale })}</p>
        <p className={cn(
          "text-sm font-semibold",
          today ? "text-blue-600" : "text-gray-700"
        )}>
          {format(day, "d")}
        </p>
      </div>

      <div className="flex-1 p-1 space-y-1 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg border border-gray-100 px-2 py-1.5 hover:border-gray-200 transition-colors"
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>

      <button
        onClick={onAddTask}
        className="flex items-center justify-center gap-1 p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors rounded-b-xl"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
