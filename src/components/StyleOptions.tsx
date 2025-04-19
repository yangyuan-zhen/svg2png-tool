import React from "react";

type StyleOptionsProps = {
  preserveStyle: boolean;
  onPreserveStyleChange: (preserve: boolean) => void;
};

export default function StyleOptions({
  preserveStyle,
  onPreserveStyleChange,
}: StyleOptionsProps) {
  return (
    <div>
      <h4 className="text-xs font-medium text-gray-600 mb-2">样式设置</h4>
      <div className="space-y-2">
        <label className="flex items-start gap-2 cursor-pointer bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={preserveStyle}
              onChange={(e) => onPreserveStyleChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-1">
            <span className="text-sm font-medium text-gray-700 block mb-0.5">
              保持 SVG 原始样式
            </span>
            <span className="text-xs text-gray-500 inline-block">
              保留SVG中的样式属性和内联样式，可能会影响最终PNG的显示效果
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
