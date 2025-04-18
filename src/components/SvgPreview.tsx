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
      <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg border">
        <div className="w-8 h-8 rounded-full border-b-2 border-gray-900 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40 text-red-500 bg-red-50 rounded-lg border border-red-200">
        <p>{error}</p>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg border">
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
      className="flex overflow-hidden justify-center items-center bg-gray-50 rounded-lg border"
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
