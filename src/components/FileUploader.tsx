import React, { useCallback, useState } from "react";

type FileUploaderProps = {
  onFileUpload: (file: File) => void;
  onSvgContentChange?: (content: string) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // 单位: MB
};

export default function FileUploader({
  onFileUpload,
  onSvgContentChange,
  accept = ".svg",
  multiple = false,
  maxSize = 5,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileValidation = (file: File): boolean => {
    // 重置错误信息
    setError(null);

    // 检查文件类型
    if (!file.name.toLowerCase().endsWith(".svg")) {
      setError("只支持上传SVG文件");
      return false;
    }

    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const processFile = useCallback(
    (file: File) => {
      if (!handleFileValidation(file)) return;

      onFileUpload(file);

      // 如果提供了SVG内容变更回调，则读取文件内容
      if (onSvgContentChange) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) {
            onSvgContentChange(content);
          }
        };
        reader.readAsText(file);
      }
    },
    [onFileUpload, onSvgContentChange, maxSize]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors duration-200 ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-white"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
          <svg
            className={`w-12 h-12 mb-2 ${
              isDragging ? "text-blue-500" : "text-gray-400"
            } transition-colors duration-200`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-1 text-sm text-gray-700">
            <span className="font-medium">
              {isDragging ? "释放文件上传" : "点击上传"}
            </span>{" "}
            或拖拽文件到这里
          </p>
          <p className="text-xs text-gray-500">支持SVG文件 (最大{maxSize}MB)</p>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
