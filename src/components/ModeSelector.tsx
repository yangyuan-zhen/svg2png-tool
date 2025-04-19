import React from "react";

export type Mode = "single" | "batch";

export type ModeSelectorProps = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
};

export default function ModeSelector({
  mode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">转换模式</h3>
      </div>
      <div className="flex border border-gray-300 rounded-md overflow-hidden">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1.5 ${
            mode === "single"
              ? "bg-blue-500 text-white"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => onModeChange("single")}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          单个SVG
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1.5 ${
            mode === "batch"
              ? "bg-blue-500 text-white"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => onModeChange("batch")}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          批量转换
        </button>
      </div>
    </div>
  );
}
