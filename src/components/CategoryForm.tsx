import { useState, useEffect } from "react";
import { Dialog } from "./ui/Dialog";
import { useStore } from "../store";
import { useT } from "../i18n";
import { PROJECT_COLORS, cn } from "../lib/utils";
import type { Category } from "../types";

interface CategoryFormProps {
  open: boolean;
  category?: Category;
  onClose: () => void;
}

export function CategoryForm({ open, category, onClose }: CategoryFormProps) {
  const { addCategory, editCategory, projects } = useStore();
  const t = useT();
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[6]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
      setProjectId(category.project_id ?? "");
    } else {
      setName("");
      setColor(PROJECT_COLORS[6]);
      setProjectId("");
    }
  }, [category, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (category) {
      await editCategory({ ...category, name: name.trim(), color, project_id: projectId || null });
    } else {
      await addCategory(name.trim(), color, projectId || null);
    }
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={category ? t.editCategory : t.newCategory}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t.name}</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.categoryNamePlaceholder}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">{t.color}</label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "w-7 h-7 rounded-full transition-transform hover:scale-110",
                  color === c && "ring-2 ring-offset-2 ring-gray-400 scale-110"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t.projectOptional}</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
          >
            <option value="">{t.allProjects}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            {category ? t.save : t.create}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
