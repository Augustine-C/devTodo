import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns";
import { TaskCard } from "../components/TaskCard";
import { useStore } from "../store";
import { cn } from "../lib/utils";
import { Dialog } from "../components/ui/Dialog";

export function MonthlyView() {
  const { tasks, currentDate, selectedProjectId, selectedCategoryId, openTaskForm } = useStore();
  const [expandDay, setExpandDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const filtered = tasks.filter((t) => {
    if (selectedProjectId && t.project_id !== selectedProjectId) return false;
    if (selectedCategoryId && t.category_id !== selectedCategoryId) return false;
    return true;
  });

  const tasksForDay = (day: Date) =>
    filtered.filter((t) => t.due_date !== null && isSameDay(new Date(t.due_date), day));

  const expandDayTasks = expandDay ? tasksForDay(expandDay) : [];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-7 mb-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-xs font-medium text-gray-400 text-center py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
          {days.map((day) => {
            const dayTasks = tasksForDay(day);
            const inMonth = isSameMonth(day, currentDate);
            const today = isToday(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => dayTasks.length > 0 && setExpandDay(day)}
                className={cn(
                  "bg-white min-h-24 p-1.5 cursor-pointer hover:bg-gray-50 transition-colors",
                  !inMonth && "bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                    today && "bg-blue-600 text-white",
                    !today && inMonth && "text-gray-700",
                    !inMonth && "text-gray-300"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); openTaskForm(undefined, day.getTime()); }}
                      className="text-gray-300 hover:text-gray-500 text-xs leading-none"
                    >
                      +
                    </button>
                  )}
                </div>

                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map((t) => (
                    <TaskPill key={t.id} task={t} />
                  ))}
                  {dayTasks.length > 3 && (
                    <p className="text-xs text-gray-400 pl-1">+{dayTasks.length - 3} more</p>
                  )}
                  {dayTasks.length === 0 && inMonth && (
                    <button
                      onClick={(e) => { e.stopPropagation(); openTaskForm(undefined, day.getTime()); }}
                      className="w-full text-gray-200 hover:text-gray-400 text-xs text-center py-1 transition-colors"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={!!expandDay}
        onOpenChange={(v) => !v && setExpandDay(null)}
        title={expandDay ? format(expandDay, "EEEE, MMMM d") : ""}
      >
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {expandDayTasks.map((t) => <TaskCard key={t.id} task={t} />)}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => { openTaskForm(undefined, expandDay?.getTime()); setExpandDay(null); }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            + Add task for this day
          </button>
        </div>
      </Dialog>
    </div>
  );
}

function TaskPill({ task }: { task: { title: string; project_id: string | null; status: string } }) {
  const { projects } = useStore();
  const project = projects.find((p) => p.id === task.project_id);

  return (
    <div
      className="px-1.5 py-0.5 rounded text-xs truncate"
      style={{
        backgroundColor: project ? project.color + "20" : "#f3f4f6",
        color: project ? project.color : "#6b7280",
      }}
    >
      {task.title}
    </div>
  );
}
