import { useState, useEffect } from "react";
import { Dialog } from "./ui/Dialog";
import { useStore } from "../store";
import type { Priority, TaskStatus } from "../types";
import { cn } from "../lib/utils";

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-blue-500" },
  { value: "medium", label: "Medium", color: "text-amber-500" },
  { value: "high", label: "High", color: "text-red-500" },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export function TaskForm() {
  const { taskForm, closeTaskForm, addTask, editTask, projects, categories } = useStore();
  const { open, item: task } = taskForm;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const isEditing = !!task?.id;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setProjectId(task.project_id ?? "");
      setCategoryId(task.category_id ?? "");
      setDueDate(task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "");
      setPriority(task.priority);
      setStatus(task.status);
    }
  }, [task]);

  const filteredCategories = categories.filter(
    (c) => !projectId || !c.project_id || c.project_id === projectId
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const dueDateMs = dueDate ? new Date(dueDate + "T00:00:00").getTime() : null;

    if (isEditing && task) {
      await editTask({
        ...task,
        title: title.trim(),
        description: description.trim() || null,
        project_id: projectId || null,
        category_id: categoryId || null,
        due_date: dueDateMs,
        priority,
        status,
      });
    } else {
      await addTask({
        title: title.trim(),
        description: description.trim() || null,
        project_id: projectId || null,
        category_id: categoryId || null,
        due_date: dueDateMs,
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
      title={isEditing ? "Edit task" : "New task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder-gray-400"
          />
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder-gray-400 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Project</label>
            <select
              value={projectId}
              onChange={(e) => { setProjectId(e.target.value); setCategoryId(""); }}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
            >
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
            >
              <option value="">No category</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
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
        </div>

        {isEditing && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            {isEditing ? "Save" : "Add task"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
