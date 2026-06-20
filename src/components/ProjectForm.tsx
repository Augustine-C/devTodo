import { useState, useEffect } from "react";
import { Dialog } from "./ui/Dialog";
import { useStore } from "../store";
import { useT } from "../i18n";
import { PROJECT_COLORS, cn } from "../lib/utils";
import type { Project } from "../types";

interface ProjectFormProps {
  open: boolean;
  project?: Project;
  onClose: () => void;
}

export function ProjectForm({ open, project, onClose }: ProjectFormProps) {
  const { addProject, editProject } = useStore();
  const t = useT();
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[5]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setColor(project.color);
      setDescription(project.description ?? "");
    } else {
      setName("");
      setColor(PROJECT_COLORS[5]);
      setDescription("");
    }
  }, [project, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (project) {
      await editProject({ ...project, name: name.trim(), color, description: description.trim() || null });
    } else {
      await addProject(name.trim(), color, description.trim() || undefined);
    }
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={project ? t.editProject : t.newProject}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t.name}</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.projectNamePlaceholder}
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
          <label className="block text-xs font-medium text-gray-500 mb-1">{t.descriptionOptional}</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.shortDescriptionPlaceholder}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
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
            {project ? t.save : t.create}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
