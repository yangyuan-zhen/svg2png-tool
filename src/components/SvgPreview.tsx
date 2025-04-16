import React from "react";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40 bg-red-50 text-red-500 rounded-lg border border-red-200">
        <p>{error}</p>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border">
        <p className="text-gray-400">无预览内容</p>
      </div>
    );
  }

  // 创建一个包含SVG的blob URL用于预览
  const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  // 在组件卸载时清理blob URL
  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center bg-gray-50 rounded-lg border overflow-hidden"
      style={{ minHeight: "200px", position: "relative" }}
    >
      <img
        src={url}
        alt="SVG 预览"
        style={{
          width: width ? `${width}px` : "auto",
          height: height ? `${height}px` : "auto",
          maxWidth: "100%",
          maxHeight: "300px",
          objectFit: keepAspectRatio ? "contain" : "fill",
        }}
      />
    </div>
  );
}
