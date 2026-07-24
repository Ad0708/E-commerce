"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SalesReportType } from "@/api/admin/report";
import { useRevenueTrend } from "@/hooks/admin/analytics/useSalesAnalytics";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function SalesAnalytics() {
  const [type, setType] = useState<SalesReportType>("daily");
  const { data, isLoading } = useRevenueTrend(type);

  const lineBrandColor = "#4f46e5";
  const hasDataPoints = data?.revenue && data.revenue.length > 0;
  const isSingleDataPoint = data?.revenue && data.revenue.length === 1;

  // --- CSV Export Handler ---
  const downloadCSV = () => {
    if (!data || !data.labels || !data.revenue) return;

    const headers = ["Timeframe / Date", "Revenue (INR)"];
    const rows = data.labels.map((label, index) => [
      `"${label}"`,
      data.revenue[index],
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sales-report-${type}-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PDF Export Handler ---
  const downloadPDF = async () => {
    if (!data || !data.labels || !data.revenue) return;

    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("SALES ANALYTICS REPORT", 15, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Frequency Filter: ${type.toUpperCase()}  |  Generated On: ${new Date().toLocaleDateString("en-IN")}`,
      15,
      30,
    );

    const totalRevenue = data.revenue.reduce((sum, val) => sum + val, 0);
    const avgRevenue = totalRevenue / (data.revenue.length || 1);

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("EXECUTIVE PERFORMANCE METRICS", 15, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Total Generated Revenue: INR ${totalRevenue.toLocaleString("en-IN")}`,
      15,
      65,
    );
    doc.text(
      `Average Transaction Value per Node: INR ${avgRevenue.toLocaleString("en-IN")}`,
      15,
      72,
    );

    const tableHeaders = [["Timeframe Period", "Revenue Valuation"]];
    const tableBody = data.labels.map((label, idx) => [
      label,
      `INR ${data.revenue[idx].toLocaleString("en-IN")}`,
    ]);

    autoTable(doc, {
      startY: 82,
      head: tableHeaders,
      body: tableBody,
      headStyles: {
        fillColor: [79, 70, 229],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 15, right: 15 },
    });

    doc.save(
      `sales-report-${type}-${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      width: "100%", // Explicit constraint
      redrawOnParentResize: true, // Forces ApexCharts to recalculate box boundaries
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
      parentHeightOffset: 0,
      dropShadow: {
        enabled: !isSingleDataPoint,
        top: 4,
        left: 0,
        blur: 4,
        color: lineBrandColor,
        opacity: 0.15,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3.5,
      lineCap: "round",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        type: "vertical",
        opacityFrom: isSingleDataPoint ? 0.05 : 0.22,
        opacityTo: 0.0,
        stops: [0, 95],
      },
    },
    colors: [lineBrandColor],
    xaxis: {
      categories: data?.labels ?? [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      range: isSingleDataPoint ? 3 : undefined,
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `₹${value.toLocaleString("en-IN")}`,
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      theme: "light",
      style: { fontSize: "12px" },
      y: {
        formatter: (value) => `₹${value.toLocaleString("en-IN")}`,
      },
    },
    grid: {
      borderColor: "rgba(226, 232, 240, 0.8)",
      strokeDashArray: 5,
      padding: {
        left: 10,
        right: 10,
        bottom: 0,
        top: 10,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    markers: {
      size: isSingleDataPoint ? 7 : 0,
      colors: [lineBrandColor],
      strokeColors: "#ffffff",
      strokeWidth: 3,
      hover: {
        size: 8,
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: data?.revenue ?? [],
    },
  ];

  return (
    <div className="w-full min-w-0 rounded-2xl border border-zinc-100 bg-white p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      {/* Header Container */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Sales Analytics
            </h2>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Real-time revenue overview and exporting tools
          </p>
        </div>

        {/* Right Actions Container */}
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div className="inline-flex items-center rounded-lg bg-zinc-100/80 p-1 dark:bg-zinc-900">
            {(["daily", "monthly", "yearly"] as SalesReportType[]).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setType(item)}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                    type === item
                      ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={downloadCSV}
              disabled={!hasDataPoints || isLoading}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              📥 CSV
            </button>
            <button
              onClick={downloadPDF}
              disabled={!hasDataPoints || isLoading}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative min-h-95 w-full min-w-0 overflow-hidden">
        {isLoading ? (
          <ChartSkeletonLoader />
        ) : !hasDataPoints ? (
          <div className="flex h-95 flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-400">
              📊
            </div>
            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              No data available
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              There is no exportable revenue data captured for this period yet.
            </p>
          </div>
        ) : (
          <div className="w-full min-w-0">
            <Chart
              type="area"
              height={380}
              width="100%"
              options={options}
              series={series}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ChartSkeletonLoader() {
  return (
    <div className="relative flex h-95 w-full flex-col justify-between pt-4 animate-pulse">
      {/* Background Grid Lines + Y-Axis Ticks */}
      <div className="absolute inset-x-0 top-4 bottom-10 flex flex-col justify-between pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 w-full">
            <div className="h-2.5 w-8 rounded bg-zinc-100 dark:bg-zinc-800/80 shrink-0" />
            <div className="w-full border-b border-dashed border-zinc-100 dark:border-zinc-800/60" />
          </div>
        ))}
      </div>

      {/* Main Chart Area: Clean Gentle Slope */}
      <div className="relative flex-1 w-full pl-12 pr-2 pt-8 flex flex-col justify-end overflow-hidden">
        <svg
          className="w-full h-full text-indigo-500/30 dark:text-indigo-400/30"
          viewBox="0 0 600 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cleanAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Soft Gradient Area */}
          <path
            d="M 0,110 Q 150,80 300,50 T 600,20 L 600,160 L 0,160 Z"
            fill="url(#cleanAreaGradient)"
          />

          {/* Gentle Curve Stroke */}
          <path
            d="M 0,110 Q 150,80 300,50 T 600,20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Subtle Vertical Grid Columns (Mimics chart hover guides) */}
        <div className="absolute inset-x-12 bottom-8 top-10 flex justify-between pointer-events-none px-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-px h-full bg-linear-to-b from-transparent via-zinc-200/40 to-transparent dark:via-zinc-800/40"
            />
          ))}
        </div>
      </div>

      {/* X-Axis Labels Skeleton */}
      <div className="flex justify-between items-center pl-12 pr-2 border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-2.5 w-10 rounded bg-zinc-100 dark:bg-zinc-800/90"
          />
        ))}
      </div>
    </div>
  );
}
