import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Search } from "lucide-react";
import { TaskCard } from "../components/TaskCard";
import { useStore } from "../store";
import { useT, useDateLocale } from "../i18n";

export function WorksDoneView() {
  const { completedTasks, projects, categories } = useStore();
  const t = useT();
  const dateLocale = useDateLocale();
  const [search, setSearch] = useState("");
  const [filterProjectId, setFilterProjectId] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");

  const filtered = useMemo(() => {
    return completedTasks.filter((task) => {
      if (filterProjectId && task.project_id !== filterProjectId) return false;
      if (filterCategoryId && task.category_id !== filterCategoryId) return false;
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [completedTasks, filterProjectId, filterCategoryId, search]);

  const grouped = useMemo(() => {
    const groups: { date: Date; tasks: typeof filtered }[] = [];
    for (const task of filtered) {
      const d = task.completed_at ? new Date(task.completed_at) : new Date();
      const existing = groups.find((g) => isSameDay(g.date, d));
      if (existing) {
        existing.tasks.push(task);
      } else {
        groups.push({ date: d, tasks: [task] });
      }
    }
    return groups.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filtered]);

  const filteredCategories = categories.filter(
    (c) => !filterProjectId || !c.project_id || c.project_id === filterProjectId
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">{t.worksDone}</h2>
          <span className="text-sm text-gray-400">{t.completedCount(completedTasks.length)}</span>
        </div>

        <div className="flex gap-2 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
          <select
            value={filterProjectId}
            onChange={(e) => { setFilterProjectId(e.target.value); setFilterCategoryId(""); }}
            className="text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white text-gray-600"
          >
            <option value="">{t.allProjects}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white text-gray-600"
          >
            <option value="">{t.allCategories}</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {grouped.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">{t.noCompletedTasks}</p>
          </div>
        ) : (
          grouped.map(({ date, tasks }) => (
            <div key={date.toISOString()} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {format(date, "EEEE, MMMM d, yyyy", { locale: dateLocale })}
              </h3>
              <div className="rounded-xl border border-gray-100 bg-white overflow-hidden divide-y divide-gray-50">
                {tasks.map((task) => <TaskCard key={task.id} task={task} showDate />)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
