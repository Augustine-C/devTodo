import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameDay, isToday, isSameMonth, addMonths,
} from "date-fns";
import { cn } from "../lib/utils";

interface DatePickerPopoverProps {
  value: Date;
  onChange: (date: Date) => void;
  trigger: React.ReactNode;
}

export function DatePickerPopover({ value, onChange, trigger }: DatePickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => startOfMonth(value));

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });

  function select(day: Date) {
    onChange(day);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={(v) => { setOpen(v); if (v) setMonth(startOfMonth(value)); }}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          className="z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-3 w-64 focus:outline-none"
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setMonth((m) => addMonths(m, -1))}
              className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setMonth(startOfMonth(new Date()))}
              className="text-xs font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2"
            >
              {format(month, "MMMM yyyy")}
            </button>
            <button
              onClick={() => setMonth((m) => addMonths(m, 1))}
              className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day of week headers */}
          <div className="grid grid-cols-7 mb-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="text-center text-xs text-gray-400 py-1 font-medium">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {days.map((day) => {
              const selected = isSameDay(day, value);
              const today = isToday(day);
              const inMonth = isSameMonth(day, month);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => select(day)}
                  className={cn(
                    "h-8 w-full rounded-lg text-xs font-medium transition-colors",
                    selected && "bg-gray-900 text-white",
                    !selected && today && "text-blue-600 font-bold bg-blue-50",
                    !selected && !today && inMonth && "text-gray-700 hover:bg-gray-100",
                    !selected && !today && !inMonth && "text-gray-300 hover:bg-gray-50",
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Jump to today */}
          <div className="mt-2 pt-2 border-t border-gray-100 text-center">
            <button
              onClick={() => select(new Date())}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              Jump to today
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
