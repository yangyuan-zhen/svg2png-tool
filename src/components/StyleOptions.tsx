import React from "react";

export type StyleOptionsProps = {
  preserveStyle: boolean;
  onPreserveStyleChange: (preserve: boolean) => void;
};

export default function StyleOptions({
  preserveStyle,
  onPreserveStyleChange,
}: StyleOptionsProps) {
  return (
    <div className="py-2">
      <h3 className="text-sm font-medium text-gray-700 mb-2">样式设置</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={preserveStyle}
            onChange={(e) => onPreserveStyleChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-gray-700">保持 SVG 原始样式</span>
          <span className="text-xs text-gray-500 ml-1">
            (保留SVG原始样式属性和内联样式)
          </span>
        </label>
      </div>
    </div>
  );
}
