import { useState, useEffect } from "react";
import { Dialog } from "./ui/Dialog";
import { useStore } from "../store";
import { useT } from "../i18n";
import type { Priority, TaskStatus } from "../types";
import { cn } from "../lib/utils";

/** 毫秒时间戳 → <input type="date"> 所需的本地 yyyy-MM-dd */
function toDateInputValue(ms: number): string {
  const d = new Date(ms);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function TaskForm() {
  const { taskForm, closeTaskForm, addTask, editTask, projects, categories } = useStore();
  const { open, item: task } = taskForm;
  const t = useT();

  const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
    { value: "low", label: t.low, color: "text-blue-500" },
    { value: "medium", label: t.medium, color: "text-amber-500" },
    { value: "high", label: t.high, color: "text-red-500" },
  ];

  const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: "todo", label: t.todo },
    { value: "in_progress", label: t.inProgress },
    { value: "done", label: t.doneStatus },
  ];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!task?.id;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setProjectId(task.project_id ?? "");
      setCategoryId(task.category_id ?? "");
      // 新建：默认“开始日期 = 今天”（可改可清）；编辑：取任务现值。
      setStartDate(
        task.start_date
          ? toDateInputValue(task.start_date)
          : task.id
            ? ""
            : toDateInputValue(Date.now())
      );
      setDueDate(task.due_date ? toDateInputValue(task.due_date) : "");
      setPriority(task.priority);
      setStatus(task.status);
      setError(null);
    }
  }, [task]);

  const filteredCategories = categories.filter(
    (c) => !projectId || !c.project_id || c.project_id === projectId
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const startMs = startDate ? new Date(startDate + "T00:00:00").getTime() : null;
    const dueMs = dueDate ? new Date(dueDate + "T00:00:00").getTime() : null;

    if (startMs !== null && dueMs !== null && startMs > dueMs) {
      setError(t.startAfterDue);
      return;
    }
    setError(null);

    if (isEditing && task) {
      await editTask({
        ...task,
        title: title.trim(),
        description: description.trim() || null,
        project_id: projectId || null,
        category_id: categoryId || null,
        start_date: startMs,
        due_date: dueMs,
        priority,
        status,
      });
    } else {
      await addTask({
        title: title.trim(),
        description: description.trim() || null,
        project_id: projectId || null,
        category_id: categoryId || null,
        start_date: startMs,
        due_date: dueMs,
        priority,
        status,
      });
    }
    closeTaskForm();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && closeTaskForm()}
      title={isEditing ? t.editTask : t.newTask}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.taskTitlePlaceholder}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder-gray-400"
          />
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descriptionPlaceholder}
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder-gray-400 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t.project}</label>
            <select
              value={projectId}
              onChange={(e) => { setProjectId(e.target.value); setCategoryId(""); }}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
            >
              <option value="">{t.noProject}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t.category}</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
            >
              <option value="">{t.noCategory}</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t.startDate}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t.dueDate}</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t.priority}</label>
          <div className="flex gap-1">
            {PRIORITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPriority(opt.value)}
                className={cn(
                  "flex-1 text-xs py-2 rounded-lg border transition-colors font-medium",
                  priority === opt.value
                    ? "border-gray-300 bg-gray-100 text-gray-800"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {isEditing && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t.status}</label>
            <div className="flex gap-1">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={cn(
                    "flex-1 text-xs py-2 rounded-lg border transition-colors",
                    status === opt.value
                      ? "border-blue-400 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={closeTaskForm}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            {isEditing ? t.save : t.addTaskBtn}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
