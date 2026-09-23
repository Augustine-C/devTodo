import { Plus } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, differenceInCalendarDays, isSameDay, isToday } from "date-fns";
import { TaskCard } from "../components/TaskCard";
import { useStore } from "../store";
import { useT, useDateLocale } from "../i18n";
import { cn } from "../lib/utils";
import type { Task, Project, Category } from "../types";

interface BarPlacement {
  task: Task;
  startCol: number;
  endCol: number;
  lane: number;
}

function isMultiDay(task: Task): boolean {
  return task.start_date !== null && task.due_date !== null && task.start_date < task.due_date;
}

function packBars(
  tasks: Task[],
  weekStart: Date,
  weekEnd: Date
): { placements: BarPlacement[]; laneCount: number } {
  const bars: { task: Task; startCol: number; endCol: number }[] = [];
  for (const task of tasks) {
    if (!isMultiDay(task)) continue;
    const startDate = new Date(task.start_date!);
    const endDate = new Date(task.due_date!);
    if (endDate < weekStart || startDate > weekEnd) continue;
    const startCol = Math.max(0, differenceInCalendarDays(startDate, weekStart));
    const endCol = Math.min(6, differenceInCalendarDays(endDate, weekStart));
    bars.push({ task, startCol, endCol });
  }
  bars.sort((a, b) => a.startCol - b.startCol || a.endCol - b.endCol);

  const lanes: { startCol: number; endCol: number }[][] = [];
  const placements: BarPlacement[] = [];
  for (const bar of bars) {
    let placed = false;
    for (let i = 0; i < lanes.length; i++) {
      const overlaps = lanes[i].some(
        (p) => bar.startCol <= p.endCol && bar.endCol >= p.startCol
      );
      if (!overlaps) {
        lanes[i].push({ startCol: bar.startCol, endCol: bar.endCol });
        placements.push({ task: bar.task, startCol: bar.startCol, endCol: bar.endCol, lane: i });
        placed = true;
        break;
      }
    }
    if (!placed) {
      lanes.push([{ startCol: bar.startCol, endCol: bar.endCol }]);
      placements.push({ task: bar.task, startCol: bar.startCol, endCol: bar.endCol, lane: lanes.length - 1 });
    }
  }
  return { placements, laneCount: lanes.length };
}

function getBarColor(task: Task, projects: Project[], categories: Category[]): string {
  if (task.project_id) {
    const project = projects.find((p) => p.id === task.project_id);
    if (project) return project.color;
  }
  if (task.category_id) {
    const category = categories.find((c) => c.id === task.category_id);
    if (category) return category.color;
  }
  return "#6b7280";
}

export function WeeklyView() {
  const { tasks, currentDate, selectedProjectId, selectedCategoryId, openTaskForm, projects, categories } = useStore();
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

  const { placements, laneCount } = packBars(filtered, weekStart, weekEnd);

  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <div className="min-w-[700px] h-full flex flex-col px-4 py-4">
        <div className="text-sm text-gray-400 mb-3 px-1">
          {t.weekOfLabel(
            format(weekStart, "MMM d", { locale: dateLocale }),
            format(weekEnd, "MMM d, yyyy", { locale: dateLocale })
          )}
        </div>

        {laneCount > 0 && (
          <div
            className="grid grid-cols-7 gap-2 mb-2"
            style={{ gridTemplateRows: `repeat(${laneCount}, minmax(24px, auto))` }}
          >
            {placements.map((p) => {
              const color = getBarColor(p.task, projects, categories);
              const isGray = color === "#6b7280";
              return (
                <button
                  key={p.task.id}
                  onClick={() => openTaskForm(p.task)}
                  title={p.task.title}
                  className="truncate text-xs px-2 py-1 rounded border-l-[3px] text-left cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                  style={{
                    gridColumn: `${p.startCol + 1} / ${p.endCol + 2}`,
                    gridRow: p.lane + 1,
                    backgroundColor: isGray ? "#f3f4f6" : color + "20",
                    color: color,
                    borderLeftColor: color,
                    borderTopColor: isGray ? "#e5e7eb" : color + "40",
                    borderRightColor: isGray ? "#e5e7eb" : color + "40",
                    borderBottomColor: isGray ? "#e5e7eb" : color + "40",
                    borderWidth: "1px",
                    borderLeftWidth: "3px",
                  }}
                >
                  {p.task.title}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-7 gap-2 flex-1">
          {days.map((day) => {
            const dayTasks = filtered.filter((task) => {
              if (task.due_date === null) return false;
              if (isMultiDay(task)) return false;
              return isSameDay(new Date(task.due_date), day);
            });
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
