import React, { useRef, useState } from "react";
import { saveAs } from "file-saver";
import { Canvg } from "canvg";
// @ts-ignore
import writePngMetadata from "png-metadata-writer";

export default function Svg2PngTool() {
  const [svgCode, setSvgCode] = useState<string>("");
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(300);
  const [keepRatio, setKeepRatio] = useState<boolean>(true);
  const [originRatio, setOriginRatio] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [dpi, setDpi] = useState<number>(300);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理 SVG 文件上传
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".svg")) {
      setError("请上传 SVG 文件");
      return;
    }
    const text = await file.text();
    setSvgCode(text);
    parseSvgSize(text);
    setError("");
  };

  // 处理粘贴 SVG 代码
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    setSvgCode(text);
    parseSvgSize(text);
    setError("");
  };

  // 解析 SVG 原始宽高
  const parseSvgSize = (code: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, "image/svg+xml");
      const svg = doc.querySelector("svg");
      if (!svg) return;
      let w = svg.getAttribute("width");
      let h = svg.getAttribute("height");
      let viewBox = svg.getAttribute("viewBox");
      let vbW = 300,
        vbH = 300;
      if (viewBox) {
        const vb = viewBox.split(" ");
        if (vb.length === 4) {
          vbW = parseFloat(vb[2]);
          vbH = parseFloat(vb[3]);
        }
      }
      if (w && h) {
        w = w.replace("px", "");
        h = h.replace("px", "");
        setWidth(Number(w));
        setHeight(Number(h));
        setOriginRatio(Number(w) / Number(h));
      } else if (viewBox) {
        setWidth(vbW);
        setHeight(vbH);
        setOriginRatio(vbW / vbH);
      } else {
        setWidth(300);
        setHeight(300);
        setOriginRatio(1);
      }
    } catch {
      setWidth(300);
      setHeight(300);
      setOriginRatio(1);
    }
  };

  // 宽高输入联动
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setWidth(value);
    if (keepRatio) setHeight(Math.round(value / originRatio));
  };
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setHeight(value);
    if (keepRatio) setWidth(Math.round(value * originRatio));
  };

  // 保持比例勾选
  const handleKeepRatio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeepRatio(e.target.checked);
    if (e.target.checked) {
      setHeight(Math.round(width / originRatio));
    }
  };

  // 导出 PNG
  const handleExport = async () => {
    try {
      if (!svgCode.trim()) {
        setError("请先上传或粘贴 SVG");
        return;
      }
      setError("");
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Canvas 初始化失败");
        return;
      }
      // 强制替换 SVG 的 width/height 属性
      function overrideSvgSize(svg: string, w: number, h: number): string {
        let s = svg;
        if (/width="[^"]*"/.test(s)) {
          s = s.replace(/width="[^"]*"/, `width=\"${w}\"`);
        } else {
          s = s.replace(/<svg/, `<svg width=\"${w}\"`);
        }
        if (/height="[^"]*"/.test(s)) {
          s = s.replace(/height="[^"]*"/, `height=\"${h}\"`);
        } else {
          s = s.replace(/<svg/, `<svg height=\"${h}\"`);
        }
        return s;
      }
      const svgWithSize = overrideSvgSize(svgCode, width, height);
      let v;
      try {
        v = await Canvg.fromString(ctx, svgWithSize, { ignoreAnimation: true });
        await v.render();
      } catch (e) {
        setError("SVG 渲染失败: " + (e instanceof Error ? e.message : e));
        return;
      }
      canvas.toBlob((blob) => {
        if (!blob) {
          setError("PNG 导出失败: Canvas.toBlob 返回空");
          return;
        }
        saveAs(blob, "export.png");
      }, "image/png");
    } catch (e) {
      setError("导出异常: " + (e instanceof Error ? e.message : e));
    }
  };

  // 预览 SVG
  const renderPreview = () => {
    if (!svgCode.trim()) return null;
    return (
      <div className="flex justify-center p-2 mb-2 bg-gray-100 rounded border">
        <div
          className="overflow-auto max-w-full max-h-60"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-3">
        {/* 上传/粘贴 */}
        <div>
          <label className="block mb-1 font-medium">上传 SVG 文件</label>
          <div
            className="flex relative flex-col justify-center items-center p-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed transition cursor-pointer hover:border-blue-400 hover:text-blue-600"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files?.[0];
              if (file && file.name.endsWith(".svg")) {
                const text = await file.text();
                setSvgCode(text);
                parseSvgSize(text);
                setError("");
              } else {
                setError("请上传 SVG 文件");
              }
            }}
            style={{ minHeight: 100 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mb-2 w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4h6v4a1 1 0 01-1 1z"
              />
            </svg>
            <span className="text-sm">点击或拖拽 SVG 文件到此处上传</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg"
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ width: "100%", height: "100%" }}
              onChange={handleFileChange}
              tabIndex={-1}
            />
            {svgCode && (
              <span className="mt-2 text-xs text-green-600">已选择文件</span>
            )}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">或粘贴 SVG 代码</label>
          <textarea
            className="p-2 w-full h-28 text-sm rounded border resize-none"
            placeholder="<svg>...</svg>"
            value={svgCode}
            onChange={(e) => {
              setSvgCode(e.target.value);
              parseSvgSize(e.target.value);
              setError("");
            }}
            onPaste={handlePaste}
          />
        </div>
        {/* 预览 */}
        {renderPreview()}
        {/* 宽高设置 */}
        <div className="flex gap-2 items-center">
          <label className="font-medium">宽度(px)</label>
          <input
            type="number"
            min={1}
            className="p-1 w-20 rounded border"
            value={width}
            onChange={handleWidthChange}
          />
          <label className="font-medium">高度(px)</label>
          <input
            type="number"
            min={1}
            className="p-1 w-20 rounded border"
            value={height}
            onChange={handleHeightChange}
          />
          <label className="flex gap-1 items-center ml-2">
            <input
              type="checkbox"
              checked={keepRatio}
              onChange={handleKeepRatio}
            />
            保持宽高比
          </label>
        </div>
        {/* 导出按钮 */}
        <button
          className="py-2 mt-2 w-full font-bold text-white bg-blue-600 rounded transition hover:bg-blue-700"
          onClick={handleExport}
        >
          导出 PNG
        </button>
        {/* 错误提示 */}
        {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
      </div>
    </div>
  );
}
