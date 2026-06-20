import { Plus, Pencil, Trash2, LayoutList, Tag } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "../lib/utils";
import { useStore } from "../store";
import type { Project, Category } from "../types";

export function Sidebar() {
  const {
    projects, categories, selectedProjectId, selectedCategoryId,
    setSelectedProject, setSelectedCategory,
    openProjectForm, openCategoryForm, removeProject, removeCategory,
  } = useStore();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => { setSelectedProject(null); setSelectedCategory(null); }}
          className={cn(
            "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors",
            !selectedProjectId && !selectedCategoryId
              ? "bg-gray-200 text-gray-900 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <LayoutList size={15} /> All tasks
        </button>
      </div>

      <SidebarSection
        label="Projects"
        onAdd={() => openProjectForm()}
      >
        {projects.map((p) => (
          <SidebarProjectItem
            key={p.id}
            project={p}
            selected={selectedProjectId === p.id}
            onSelect={() => { setSelectedProject(p.id); setSelectedCategory(null); }}
            onEdit={() => openProjectForm(p)}
            onDelete={() => removeProject(p.id)}
          />
        ))}
        {projects.length === 0 && (
          <p className="px-2.5 py-1.5 text-xs text-gray-400">No projects yet</p>
        )}
      </SidebarSection>

      <SidebarSection
        label="Categories"
        onAdd={() => openCategoryForm()}
      >
        {categories.map((c) => (
          <SidebarCategoryItem
            key={c.id}
            category={c}
            selected={selectedCategoryId === c.id}
            onSelect={() => { setSelectedCategory(c.id); setSelectedProject(null); }}
            onEdit={() => openCategoryForm(c)}
            onDelete={() => removeCategory(c.id)}
          />
        ))}
        {categories.length === 0 && (
          <p className="px-2.5 py-1.5 text-xs text-gray-400">No categories yet</p>
        )}
      </SidebarSection>
    </aside>
  );
}

function SidebarSection({ label, onAdd, children }: {
  label: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        <button
          onClick={onAdd}
          className="p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Plus size={13} />
        </button>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarProjectItem({ project, selected, onSelect, onEdit, onDelete }: {
  project: Project;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <SidebarItem
      label={project.name}
      selected={selected}
      onSelect={onSelect}
      onEdit={onEdit}
      onDelete={onDelete}
      icon={
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
      }
    />
  );
}

function SidebarCategoryItem({ category, selected, onSelect, onEdit, onDelete }: {
  category: Category;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <SidebarItem
      label={category.name}
      selected={selected}
      onSelect={onSelect}
      onEdit={onEdit}
      onDelete={onDelete}
      icon={
        <Tag size={11} className="flex-shrink-0" style={{ color: category.color }} />
      }
    />
  );
}

function SidebarItem({ label, selected, onSelect, onEdit, onDelete, icon }: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <DropdownMenu.Root>
      <div
        onClick={onSelect}
        className={cn(
          "group flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-sm transition-colors",
          selected ? "bg-gray-200 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-100"
        )}
      >
        {icon}
        <span className="flex-1 truncate text-sm">{label}</span>
        <DropdownMenu.Trigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-300 transition-all"
          >
            <Pencil size={11} />
          </button>
        </DropdownMenu.Trigger>
      </div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-28 bg-white rounded-lg shadow-lg border border-gray-200 p-1 text-sm"
          align="end"
          sideOffset={4}
        >
          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100 outline-none"
            onSelect={onEdit}
          >
            <Pencil size={12} /> Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-red-600 hover:bg-red-50 outline-none"
            onSelect={onDelete}
          >
            <Trash2 size={12} /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
