import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, title, children, className }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-50 animate-in fade-in-0" />
        <RadixDialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "bg-white rounded-xl shadow-xl border border-gray-200",
            "w-full max-w-lg p-6 focus:outline-none",
            "animate-in fade-in-0 zoom-in-95",
            className
          )}
        >
          <div className="flex items-center justify-between mb-5">
            <RadixDialog.Title className="text-base font-semibold text-gray-900">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X size={16} />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
