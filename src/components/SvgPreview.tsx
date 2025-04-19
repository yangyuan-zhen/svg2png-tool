import React, { useEffect, useState } from "react";

type SvgPreviewProps = {
  svgContent: string;
  width?: number;
  height?: number;
  keepAspectRatio?: boolean;
  loading?: boolean;
  error?: string;
};

export default function SvgPreview({
  svgContent,
  width,
  height,
  keepAspectRatio = true,
  loading = false,
  error,
}: SvgPreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // 服务器端渲染兼容处理
  useEffect(() => {
    if (svgContent) {
      // 创建一个包含SVG的blob URL用于预览 (仅在客户端执行)
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      setPreviewUrl(url);

      // 在组件卸载或URL变化时清理blob URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [svgContent]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-60 bg-gray-50 rounded-lg border border-gray-200 p-5">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-gray-600 animate-pulse">处理中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-60 bg-red-50 rounded-lg border border-red-200 p-5">
        <svg
          className="w-10 h-10 text-red-500 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938-9L12 4.938 18.938 12 12 19.062 5.062 12z"
          />
        </svg>
        <p className="text-sm text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="flex flex-col justify-center items-center h-60 bg-gray-50 rounded-lg border border-gray-200 p-5">
        <svg
          className="w-10 h-10 text-gray-300 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-gray-400">等待 SVG 文件或代码</p>
      </div>
    );
  }

  // 计算宽高比的显示值
  const aspectRatio = width && height ? (width / height).toFixed(2) : "-";

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="flex overflow-hidden justify-center items-center bg-[#f8f9fa] rounded-lg border border-gray-200 p-4"
        style={{
          minHeight: "240px",
          backgroundImage:
            "linear-gradient(45deg, #eaeaea 25%, transparent 25%, transparent 75%, #eaeaea 75%, #eaeaea), linear-gradient(45deg, #eaeaea 25%, transparent 25%, transparent 75%, #eaeaea 75%, #eaeaea)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
          position: "relative",
        }}
      >
        {previewUrl && (
          <img
            src={previewUrl}
            alt="SVG 预览"
            className="drop-shadow-sm transition-all duration-200"
            style={{
              width: width ? `${width}px` : "auto",
              height: height ? `${height}px` : "auto",
              maxWidth: "100%",
              maxHeight: "300px",
              objectFit: keepAspectRatio ? "contain" : "fill",
            }}
          />
        )}
      </div>

      {/* 预览信息 */}
      <div className="flex flex-wrap text-xs text-gray-500 justify-between">
        <div className="flex items-center space-x-3">
          <span className="px-2 py-1 bg-gray-100 rounded-md">
            {width} × {height} px
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-md">
            比例: {aspectRatio}
          </span>
        </div>
        <span className="px-2 py-1 bg-gray-100 rounded-md">
          模式: {keepAspectRatio ? "保持比例" : "拉伸"}
        </span>
      </div>
    </div>
  );
}
