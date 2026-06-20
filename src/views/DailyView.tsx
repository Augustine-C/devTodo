import { Plus } from "lucide-react";
import { format, isToday, startOfDay } from "date-fns";
import { TaskCard } from "../components/TaskCard";
import { useStore } from "../store";
import { useT, useDateLocale } from "../i18n";
import type { Task } from "../types";

export function DailyView() {
  const { tasks, completedTasks, currentDate, selectedProjectId, selectedCategoryId, openTaskForm } = useStore();
  const t = useT();
  const dateLocale = useDateLocale();

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

  const upcomingByDate = upcoming.reduce<{ date: number; tasks: Task[] }[]>((acc, task) => {
    const d = startOfDay(new Date(task.due_date!)).getTime();
    const group = acc.find((g) => g.date === d);
    if (group) group.tasks.push(task);
    else acc.push({ date: d, tasks: [task] });
    return acc;
  }, []);

  const doneToday = completedTasks.filter((task) => {
    if (selectedProjectId && task.project_id !== selectedProjectId) return false;
    if (selectedCategoryId && task.category_id !== selectedCategoryId) return false;
    return task.completed_at !== null && task.completed_at >= dayStartMs && task.completed_at < dayEndMs;
  });

  const isCurrentToday = isToday(currentDate);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isCurrentToday ? t.todayBtn : format(currentDate, "EEEE", { locale: dateLocale })}
            </h2>
            <p className="text-sm text-gray-400">{format(currentDate, "MMMM d, yyyy", { locale: dateLocale })}</p>
          </div>
          <button
            onClick={() => openTaskForm(undefined, dayStartMs)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus size={14} /> {t.addTaskBtn}
          </button>
        </div>

        {/* Today's tasks */}
        <Section
          label={isCurrentToday ? t.dueToday : `${t.dueDateFmt} ${format(currentDate, "MMM d", { locale: dateLocale })}`}
          empty={t.noTasksDueToday}
          highlight
        >
          {todayTasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </Section>

        {/* Overdue */}
        {overdue.length > 0 && (
          <Section label={t.overdueLabel(overdue.length)} labelClass="text-red-500">
            {overdue.map((task) => <TaskCard key={task.id} task={task} showDate />)}
          </Section>
        )}

        {/* Upcoming grouped by day */}
        {upcomingByDate.map(({ date, tasks: group }) => (
          <Section key={date} label={format(new Date(date), "EEE, MMM d", { locale: dateLocale })}>
            {group.map((task) => <TaskCard key={task.id} task={task} />)}
          </Section>
        ))}

        {/* No due date */}
        {noDate.length > 0 && (
          <Section label={t.noDate}>
            {noDate.map((task) => <TaskCard key={task.id} task={task} />)}
          </Section>
        )}

        {/* Done today */}
        {doneToday.length > 0 && (
          <Section label={t.doneTodayLabel(doneToday.length)} labelClass="text-green-600">
            {doneToday.map((task) => <TaskCard key={task.id} task={task} />)}
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
