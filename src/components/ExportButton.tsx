import React from "react";

export type ExportButtonProps = {
  mode: "single" | "batch";
  onExport: () => void;
  isExporting: boolean;
  fileCount: number;
  disabled?: boolean;
};

export default function ExportButton({
  mode,
  onExport,
  isExporting,
  fileCount,
  disabled = false,
}: ExportButtonProps) {
  const isSingleMode = mode === "single";

  // 根据模式和状态决定按钮文字
  const buttonText = isExporting
    ? "正在导出..."
    : isSingleMode
    ? "导出 PNG"
    : `批量导出 ${fileCount} 个文件`;

  // 根据模式决定按钮颜色
  const buttonClass = isSingleMode
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-green-600 hover:bg-green-700";

  return (
    <div>
      <button
        className={`w-full py-2 px-4 text-white font-medium ${buttonClass} rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={onExport}
        disabled={disabled || isExporting}
      >
        {buttonText}
      </button>
    </div>
  );
}
