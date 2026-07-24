"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      className,
      id,
      name,
    },
    ref,
  ) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isOn = isControlled ? checked : internalChecked;

    const toggle = () => {
      if (disabled) return;
      const next = !isOn;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    };

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        onClick={toggle}
        data-state={isOn ? "checked" : "unchecked"}
        className={cn(
          // Track sizing and base aesthetics
          "group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
          "border-2 border-transparent transition-all duration-300 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
          "disabled:cursor-not-allowed disabled:opacity-40",
          // Track Themes: Indigo when active, smooth neutral gray when inactive
          isOn 
            ? "bg-indigo-600 dark:bg-indigo-500 shadow-sm shadow-indigo-500/20" 
            : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700",
          className,
        )}
      >
        <span
          className={cn(
            // Thumb base aesthetics (Crisp white pill look)
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-all duration-300 ease-in-out",
            "dark:bg-slate-100",
            // Linear movement
            isOn ? "translate-x-5" : "translate-x-0",
            // The secret sauce: Active pressing/hover micro-animations
            "group-active:w-6", // Stretches like putty slightly when clicked
            isOn ? "group-active:translate-x-4" : "group-active:translate-x-0"
          )}
        />
        {name && <input type="hidden" name={name} value={isOn ? "on" : "off"} />}
      </button>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };