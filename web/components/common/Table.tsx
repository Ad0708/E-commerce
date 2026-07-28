"use client";

import {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export function Table({
  className = "",
  containerClassName = "",
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  console.log(containerClassName);
  return (
    /* Outer layout card handling background theme accents and constraints independently */
    <div className="w-full rounded-2xl border border-blue-100/70 bg-blue-50/30 shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden flex flex-col">
      <div className={`w-full overflow-x-auto overflow-y-auto h-fit ${containerClassName}`}>
        <table
          /* 'min-w-full' keeps columns from squeezing; standard display attributes remain intact */
          className={`min-w-full border-collapse table-auto ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

export function TableHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`border-b border-blue-100/80 dark:border-slate-800 ${className}`}
      {...props}
    />
  );
}

export function TableBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={`divide-y divide-blue-50/60 bg-white text-sm dark:divide-slate-800/40 dark:bg-slate-950 ${className}`}
      {...props}
    />
  );
}

export function TableRow({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`transition-colors duration-150 hover:bg-blue-50/40 dark:hover:bg-slate-900/40 ${className}`}
      {...props}
    />
  );
}

export function TableHead({
  className = "",
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`sticky top-0 z-20 bg-blue-50 dark:bg-slate-900 px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500/90 dark:text-slate-400 align-middle whitespace-nowrap ${className}`}
      {...props}
    />
  );
}

export function TableCell({
  className = "",
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    /* 1. 'py-3.5' restores a clean balance—not too small, not vertically bloated.
      2. 'whitespace-nowrap' stops cell content from breaking into multiple vertical lines, keeping row heights perfectly compact.
    */
    <td
      className={`px-6 py-3.5 align-middle text-slate-700 dark:text-slate-200 whitespace-nowrap ${className}`}
      {...props}
    />
  );
}
