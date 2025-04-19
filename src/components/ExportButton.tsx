import React from "react";

type ExportButtonProps = {
  mode: "single" | "batch";
  onExport: () => void;
  isExporting: boolean;
  fileCount?: number;
  disabled?: boolean;
};

export default function ExportButton({
  mode,
  onExport,
  isExporting,
  fileCount = 0,
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
    ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
    : "bg-green-600 hover:bg-green-700 focus:ring-green-500";

  return (
    <div>
      <button
        className={`w-full py-3 px-4 text-white font-medium ${buttonClass} rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
        onClick={onExport}
        disabled={disabled || isExporting}
      >
        {isExporting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            {buttonText}
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {buttonText}
          </>
        )}
      </button>
    </div>
  );
}
