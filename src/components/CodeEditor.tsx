import React, { useState, useEffect } from "react";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  label?: string;
};

// 简单检查 SVG 是否有效，确保只在客户端执行
function isValidSvg(code: string): boolean {
  if (!code.trim()) return true;
  // 检查是否在浏览器环境中
  if (typeof window === "undefined") return true;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, "image/svg+xml");
    return (
      !doc.querySelector("parsererror") && doc.querySelector("svg") !== null
    );
  } catch {
    return false;
  }
}

// 简单的语法高亮逻辑（针对SVG）
function highlightSvgSyntax(code: string): string {
  return code
    .replace(
      /<\/?([a-zA-Z0-9]+)(?:\s+[^>]*)?>/g,
      '<span class="text-blue-600">$&</span>'
    )
    .replace(/="[^"]*"/g, '<span class="text-green-600">$&</span>')
    .replace(/<!--[\s\S]*?-->/g, '<span class="text-gray-500">$&</span>');
}

export default function CodeEditor({
  value,
  onChange,
  placeholder = "在此处粘贴SVG代码...",
  minHeight = "200px",
  maxHeight = "400px",
  label = "SVG代码",
}: CodeEditorProps) {
  const [localValue, setLocalValue] = useState("");
  const [highlighted, setHighlighted] = useState("");
  const [isValid, setIsValid] = useState(true);

  // 当外部value变化时更新本地状态
  useEffect(() => {
    setLocalValue(value);
    setHighlighted(highlightSvgSyntax(value));
    // 在客户端检查SVG有效性
    setIsValid(isValidSvg(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setHighlighted(highlightSvgSyntax(newValue));
    // 在客户端检查SVG有效性
    setIsValid(isValidSvg(newValue));
    onChange(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // 允许正常的粘贴操作
    const clipboardData = e.clipboardData;
    const pastedText = clipboardData.getData("text");
    if (pastedText) {
      // 检查是否是完整的 SVG
      if (
        pastedText.trim().startsWith("<svg") &&
        pastedText.includes("</svg>")
      ) {
        // 这是一个 SVG，更新整个文本框
        setLocalValue(pastedText);
        setHighlighted(highlightSvgSyntax(pastedText));
        setIsValid(isValidSvg(pastedText));
        onChange(pastedText);
        e.preventDefault(); // 阻止默认粘贴行为
      }
    }
  };

  const handleClear = () => {
    setLocalValue("");
    setHighlighted("");
    setIsValid(true);
    onChange("");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            清空
          </button>
        )}
      </div>
      <div className="relative font-mono rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 hover:border-gray-400 transition-all shadow-sm bg-gray-50">
        <div
          className="absolute top-0 left-0 right-0 p-3 whitespace-pre-wrap break-words opacity-0 pointer-events-none"
          style={{ minHeight, maxHeight, overflowY: "auto" }}
        >
          {localValue || placeholder}
        </div>
        <textarea
          value={localValue}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder={placeholder}
          className={`w-full p-3 font-mono text-sm bg-transparent resize-y ${
            !isValid && localValue.trim() !== ""
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }`}
          style={{
            minHeight,
            maxHeight,
            caretColor: "black",
          }}
        />
      </div>
      {!isValid && localValue.trim() !== "" && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          无法解析SVG内容，请检查代码是否正确
        </p>
      )}
    </div>
  );
}
