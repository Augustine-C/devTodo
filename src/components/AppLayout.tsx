import { ChevronLeft, ChevronRight, Calendar, LayoutDashboard, CalendarDays, CheckCircle2, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { useStore } from "../store";
import { useT, useDateLocale } from "../i18n";
import type { Locale } from "../i18n";
import { Sidebar } from "./Sidebar";
import { DailyView } from "../views/DailyView";
import { WeeklyView } from "../views/WeeklyView";
import { MonthlyView } from "../views/MonthlyView";
import { WorksDoneView } from "../views/WorksDoneView";
import { TaskForm } from "./TaskForm";
import { ProjectForm } from "./ProjectForm";
import { CategoryForm } from "./CategoryForm";
import { DatePickerPopover } from "./DatePickerPopover";
import type { View } from "../types";

export function AppLayout() {
  const {
    activeView, currentDate, navigateDate, goToToday, setCurrentDate,
    setActiveView, openTaskForm, locale, setLocale,
    projectForm, closeProjectForm,
    categoryForm, closeCategoryForm,
  } = useStore();
  const t = useT();
  const dateLocale = useDateLocale();

  const VIEWS: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "daily", label: t.daily, icon: <Calendar size={14} /> },
    { id: "weekly", label: t.weekly, icon: <LayoutDashboard size={14} /> },
    { id: "monthly", label: t.monthly, icon: <CalendarDays size={14} /> },
    { id: "done", label: t.done, icon: <CheckCircle2 size={14} /> },
  ];

  function viewLabel(view: View): string {
    if (view === "daily") return format(currentDate, "MMM d", { locale: dateLocale });
    if (view === "weekly") {
      if (locale === "zh") return format(currentDate, "M月d日", { locale: dateLocale });
      return format(currentDate, "'Week of' MMM d", { locale: dateLocale });
    }
    if (view === "monthly") return format(currentDate, "MMMM yyyy", { locale: dateLocale });
    return "";
  }

  const showNav = activeView !== "done";
  const otherLocale: Locale = locale === "zh" ? "en" : "zh";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white flex-shrink-0" data-tauri-drag-region>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900 tracking-tight select-none">DevTodo</span>
          {showNav && (
            <>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateDate(-1)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {activeView === "daily" ? (
                  <DatePickerPopover
                    value={currentDate}
                    onChange={setCurrentDate}
                    trigger={
                      <button className="text-xs text-gray-500 w-28 text-center px-1 py-1 rounded hover:bg-gray-100 transition-colors">
                        {viewLabel(activeView)}
                      </button>
                    }
                  />
                ) : (
                  <span className="text-xs text-gray-500 w-28 text-center">
                    {viewLabel(activeView)}
                  </span>
                )}
                <button
                  onClick={() => navigateDate(1)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <button
                onClick={goToToday}
                className="text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              >
                {t.todayBtn}
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(otherLocale)}
            className="text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            {otherLocale === "zh" ? "中文" : "EN"}
          </button>

          <nav className="flex items-center bg-gray-100 rounded-lg p-0.5">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  activeView === v.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {v.icon}
                {v.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => openTaskForm()}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus size={12} /> {t.addTask}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeView === "daily" && <DailyView />}
          {activeView === "weekly" && <WeeklyView />}
          {activeView === "monthly" && <MonthlyView />}
          {activeView === "done" && <WorksDoneView />}
        </main>
      </div>

      {/* Modals */}
      <TaskForm />
      <ProjectForm
        open={projectForm.open}
        project={projectForm.item}
        onClose={closeProjectForm}
      />
      <CategoryForm
        open={categoryForm.open}
        category={categoryForm.item}
        onClose={closeCategoryForm}
      />
    </div>
  );
}
