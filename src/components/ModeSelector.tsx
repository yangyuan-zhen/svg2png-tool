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
    <div className="flex border border-gray-300 rounded-md overflow-hidden">
      <button
        className={`flex-1 py-2 px-4 text-sm font-medium ${
          mode === "single"
            ? "bg-blue-500 text-white"
            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => onModeChange("single")}
      >
        单个SVG
      </button>
      <button
        className={`flex-1 py-2 px-4 text-sm font-medium ${
          mode === "batch"
            ? "bg-blue-500 text-white"
            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        }`}
        onClick={() => onModeChange("batch")}
      >
        批量转换
      </button>
    </div>
  );
}
