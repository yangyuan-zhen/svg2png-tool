import React, { useState, useEffect } from "react";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string | number;
  maxHeight?: string | number;
  label?: string;
};

export default function CodeEditor({
  value,
  onChange,
  placeholder = "在此处粘贴SVG代码...",
  minHeight = "200px",
  maxHeight = "400px",
  label = "SVG代码",
}: CodeEditorProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  // 检查输入的内容是否为有效的SVG代码
  const isValidSvg = (content: string): boolean => {
    return content.trim().startsWith("<svg") && content.includes("</svg>");
  };

  // 处理粘贴事件，提取SVG部分
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");

    // 尝试提取SVG标签之间的内容
    const svgMatch = pastedText.match(/<svg[\s\S]*?<\/svg>/i);

    if (svgMatch) {
      e.preventDefault();
      const svgContent = svgMatch[0];
      setLocalValue(svgContent);
      onChange(svgContent);
    }
  };

  // 清空编辑器内容
  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
          >
            清空
          </button>
        )}
      </div>
      <div className="relative">
        <textarea
          value={localValue}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder={placeholder}
          className={`w-full p-3 border border-gray-300 rounded-md font-mono text-sm ${
            !isValidSvg(localValue) && localValue.trim() !== ""
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "focus:ring-blue-500 focus:border-blue-500"
          }`}
          style={{
            minHeight,
            maxHeight,
            resize: "vertical",
          }}
        />
        {!isValidSvg(localValue) && localValue.trim() !== "" && (
          <p className="mt-1 text-xs text-red-500">
            输入的内容不是有效的SVG代码
          </p>
        )}
        {localValue.trim() === "" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="ml-2 text-gray-400">{placeholder}</span>
          </div>
        )}
      </div>
    </div>
  );
}
