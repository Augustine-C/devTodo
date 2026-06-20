import { Plus } from "lucide-react";
import { format, isToday, startOfDay } from "date-fns";
import { TaskCard } from "../components/TaskCard";
import { useStore } from "../store";
import type { Task } from "../types";

export function DailyView() {
  const { tasks, completedTasks, currentDate, selectedProjectId, selectedCategoryId, openTaskForm } = useStore();

  const dayStart = startOfDay(currentDate);
  const dayStartMs = dayStart.getTime();
  const dayEndMs = dayStartMs + 86400000;

  const filtered = tasks.filter((t) => {
    if (selectedProjectId && t.project_id !== selectedProjectId) return false;
    if (selectedCategoryId && t.category_id !== selectedCategoryId) return false;
    return true;
  });

  const todayTasks = filtered.filter(
    (t) => t.due_date !== null && t.due_date >= dayStartMs && t.due_date < dayEndMs
  );
  const overdue = filtered.filter(
    (t) => t.due_date !== null && t.due_date < dayStartMs
  );
  const upcoming = filtered.filter(
    (t) => t.due_date !== null && t.due_date >= dayEndMs
  );
  const noDate = filtered.filter((t) => t.due_date === null);

  // Group upcoming tasks by date
  const upcomingByDate = upcoming.reduce<{ date: number; tasks: Task[] }[]>((acc, t) => {
    const d = startOfDay(new Date(t.due_date!)).getTime();
    const group = acc.find((g) => g.date === d);
    if (group) group.tasks.push(t);
    else acc.push({ date: d, tasks: [t] });
    return acc;
  }, []);

  const doneToday = completedTasks.filter((t) => {
    if (selectedProjectId && t.project_id !== selectedProjectId) return false;
    if (selectedCategoryId && t.category_id !== selectedCategoryId) return false;
    return t.completed_at !== null && t.completed_at >= dayStartMs && t.completed_at < dayEndMs;
  });

  const isCurrentToday = isToday(currentDate);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isCurrentToday ? "Today" : format(currentDate, "EEEE")}
            </h2>
            <p className="text-sm text-gray-400">{format(currentDate, "MMMM d, yyyy")}</p>
          </div>
          <button
            onClick={() => openTaskForm(undefined, dayStartMs)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus size={14} /> Add task
          </button>
        </div>

        {/* Today's tasks — always at the top */}
        <Section
          label={isCurrentToday ? "Due today" : `Due ${format(currentDate, "MMM d")}`}
          empty="No tasks due today"
          highlight
        >
          {todayTasks.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>

        {/* Overdue — accumulated past items */}
        {overdue.length > 0 && (
          <Section label={`Overdue · ${overdue.length}`} labelClass="text-red-500">
            {overdue.map((t) => <TaskCard key={t.id} task={t} showDate />)}
          </Section>
        )}

        {/* Upcoming — grouped by day */}
        {upcomingByDate.map(({ date, tasks: group }) => (
          <Section key={date} label={format(new Date(date), "EEE, MMM d")}>
            {group.map((t) => <TaskCard key={t.id} task={t} />)}
          </Section>
        ))}

        {/* Backlog — no due date */}
        {noDate.length > 0 && (
          <Section label="No due date">
            {noDate.map((t) => <TaskCard key={t.id} task={t} />)}
          </Section>
        )}

        {/* Done today */}
        {doneToday.length > 0 && (
          <Section label={`Done today · ${doneToday.length}`} labelClass="text-green-600">
            {doneToday.map((t) => <TaskCard key={t.id} task={t} />)}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ label, labelClass, empty, highlight, children }: {
  label: string;
  labelClass?: string;
  empty?: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div className="mb-5">
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${labelClass ?? "text-gray-400"}`}>
        {label}
      </h3>
      <div className={`rounded-xl border bg-white overflow-hidden divide-y divide-gray-50 ${
        highlight ? "border-blue-100 shadow-sm shadow-blue-50" : "border-gray-100"
      }`}>
        {!hasChildren && empty ? (
          <p className="px-3 py-4 text-sm text-gray-400 text-center">{empty}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
