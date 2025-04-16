import React, { useRef, useState } from "react";
import { saveAs } from "file-saver";
import { Canvg } from "canvg";

// 尺寸预设列表，包含尺寸和应用场景
const SIZE_PRESETS = [
  { width: 16, height: 16, name: "16x16", description: "小型图标，favicon" },
  { width: 32, height: 32, name: "32x32", description: "标准图标" },
  { width: 64, height: 64, name: "64x64", description: "中型图标，APP图标" },
  { width: 128, height: 128, name: "128x128", description: "大型图标" },
  {
    width: 256,
    height: 256,
    name: "256x256",
    description: "高清图标，小型logo",
  },
  { width: 512, height: 512, name: "512x512", description: "标准logo，宣传图" },
  { width: 1024, height: 1024, name: "1024x1024", description: "高清设计素材" },
  {
    width: 1200,
    height: 630,
    name: "1200x630",
    description: "社交媒体分享图（Facebook, Twitter）",
  },
  {
    width: 1080,
    height: 1080,
    name: "1080x1080",
    description: "Instagram, 微信朋友圈",
  },
  {
    width: 1920,
    height: 1080,
    name: "1920x1080",
    description: "高清壁纸，Full HD",
  },
];

export default function Svg2PngTool() {
  const [svgCode, setSvgCode] = useState<string>("");
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(300);
  const [keepRatio, setKeepRatio] = useState<boolean>(true);
  const [originRatio, setOriginRatio] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [preserveStyle, setPreserveStyle] = useState<boolean>(true);
  const [showSizePresets, setShowSizePresets] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [svgFiles, setSvgFiles] = useState<File[]>([]);

  // 设置预设尺寸
  const handlePresetSelect = (width: number, height: number) => {
    setWidth(width);
    setHeight(height);
    if (keepRatio) {
      setOriginRatio(width / height);
    }
    setShowSizePresets(false);
  };

  // 处理 SVG 文件上传（支持多文件）
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.name.endsWith(".svg")
    );
    if (files.length === 0) {
      setError("请上传 SVG 文件");
      return;
    }
    setSvgFiles(files);
    // 默认显示第一个SVG内容
    const text = await files[0].text();
    setSvgCode(text);
    parseSvgSize(text);
    setError("");

    // 如果上传了多个文件，自动切换到批量模式
    if (files.length > 1) {
      setMode("batch");
    }
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

  // 强制替换 SVG 的 width/height 属性
  function overrideSvgSize(svg: string, w: number, h: number): string {
    let s = svg;

    // 即使保持原始样式，我们也需要设置viewBox来确保正确的显示比例
    // 首先，提取现有的viewBox
    const viewBoxMatch = s.match(/viewBox=["']([^"']*)["']/);
    let viewBox = viewBoxMatch
      ? viewBoxMatch[1].split(/\s+/).map(Number)
      : [0, 0, w, h];

    if (preserveStyle) {
      // 检查 SVG 是否已有 width 和 height 属性
      const hasWidth = /width=["'][^"']*["']/.test(s);
      const hasHeight = /height=["'][^"']*["']/.test(s);

      // 如果有 width 属性，替换它；否则添加它
      if (hasWidth) {
        s = s.replace(/width=["'][^"']*["']/, `width="${w}"`);
      } else {
        s = s.replace(/<svg/, `<svg width="${w}"`);
      }

      // 如果有 height 属性，替换它；否则添加它
      if (hasHeight) {
        s = s.replace(/height=["'][^"']*["']/, `height="${h}"`);
      } else {
        s = s.replace(/<svg/, `<svg height="${h}"`);
      }

      return s;
    } else {
      // 完全替换宽高属性
      if (/width=["'][^"']*["']/.test(s)) {
        s = s.replace(/width=["'][^"']*["']/, `width="${w}"`);
      } else {
        s = s.replace(/<svg/, `<svg width="${w}"`);
      }
      if (/height=["'][^"']*["']/.test(s)) {
        s = s.replace(/height=["'][^"']*["']/, `height="${h}"`);
      } else {
        s = s.replace(/<svg/, `<svg height="${h}"`);
      }
      return s;
    }
  }

  // 导出当前 PNG
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
      const svgWithSize = overrideSvgSize(svgCode, width, height);
      let v;
      try {
        v = await Canvg.fromString(ctx, svgWithSize, {
          ignoreAnimation: true,
          // canvg 不直接支持 width/height 选项，我们通过 SVG 的宽高属性控制
        });
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

  // 批量导出 PNG
  const handleBatchExport = async () => {
    if (svgFiles.length === 0) {
      setError("请先上传 SVG 文件");
      return;
    }
    setError("");

    // 显示导出进度
    setError("正在导出...");

    try {
      for (let i = 0; i < svgFiles.length; i++) {
        const file = svgFiles[i];
        const text = await file.text();
        // 对每个SVG都应用尺寸设置
        const svgWithSize = overrideSvgSize(text, width, height);

        // 更新进度
        setError(`正在处理 ${i + 1}/${svgFiles.length}: ${file.name}`);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        try {
          const v = await Canvg.fromString(ctx, svgWithSize, {
            ignoreAnimation: true,
          });
          await v.render();
          await new Promise<void>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) {
                const pngName = file.name.replace(/\.svg$/i, ".png");
                saveAs(blob, pngName);
              }
              resolve();
            }, "image/png");
          });
        } catch (e) {
          // 记录单个文件错误但继续处理
          console.error(`处理文件 ${file.name} 时出错:`, e);
        }
      }
      // 导出完成
      setError("导出完成！");
      setTimeout(() => setError(""), 3000);
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
        {/* 模式切换 */}
        <div className="flex gap-2 p-2 mb-2 bg-gray-50 rounded">
          <label className="flex gap-1 items-center">
            <input
              type="radio"
              checked={mode === "single"}
              onChange={() => setMode("single")}
            />
            <span>单个转换</span>
          </label>
          <label className="flex gap-1 items-center">
            <input
              type="radio"
              checked={mode === "batch"}
              onChange={() => setMode("batch")}
            />
            <span>批量转换</span>
          </label>
        </div>

        {/* 上传 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-medium">上传 SVG 文件</label>
            {svgFiles.length > 0 && (
              <button
                className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => {
                  setSvgFiles([]);
                  setSvgCode("");
                  setError("");
                  setWidth(300);
                  setHeight(300);
                  setOriginRatio(1);
                  // 直接设置模式，确保立即切换
                  setTimeout(() => {
                    setMode("single");
                  }, 0);
                }}
              >
                清除队列
              </button>
            )}
          </div>
          <div
            className="flex relative flex-col justify-center items-center p-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed transition cursor-pointer hover:border-blue-400 hover:text-blue-600"
            onClick={(e) => {
              // 阻止事件冒泡，防止触发两次文件选择
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = Array.from(e.dataTransfer.files || []).filter((f) =>
                f.name.endsWith(".svg")
              );
              if (files.length > 0) {
                setSvgFiles(files);
                // 如果上传了多个文件，自动切换到批量模式
                if (files.length > 1) {
                  setMode("batch");
                }
                const text = await files[0].text();
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
            <span className="mt-1 text-xs text-gray-400">
              支持批量上传，按住 Ctrl 键选择多个文件，或同时拖入多个文件
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg"
              multiple
              className="absolute inset-0 opacity-0 pointer-events-none -z-10" // 防止直接点击，改用外层div触发
              onChange={handleFileChange}
              tabIndex={-1}
            />
            {svgFiles.length > 0 && (
              <div className="mt-2 text-xs text-green-600">
                已选择文件：
                {svgFiles.length > 3
                  ? `${svgFiles.length} 个文件`
                  : svgFiles.map((f) => f.name).join("、")}
              </div>
            )}
          </div>
        </div>

        {/* 粘贴SVG代码 - 仅在单个模式下显示 */}
        {mode === "single" && (
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
        )}

        {/* 预览 - 仅在单个模式下显示 */}
        {mode === "single" && renderPreview()}

        {/* 宽高设置 */}
        <div className="mb-2">
          <div className="flex justify-between items-center">
            <div className="mb-1 text-base font-medium">导出尺寸设置</div>
            <button
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={() => setShowSizePresets(!showSizePresets)}
            >
              {showSizePresets ? "隐藏预设尺寸" : "显示常用尺寸预设"}
            </button>
          </div>

          {/* 尺寸预设面板 */}
          {showSizePresets && (
            <div className="p-3 mb-3 bg-gray-50 rounded border">
              <div className="mb-2 text-sm font-medium">常用尺寸预设：</div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    className="flex justify-between items-center p-2 text-sm text-left bg-white rounded border hover:bg-blue-50"
                    onClick={() =>
                      handlePresetSelect(preset.width, preset.height)
                    }
                  >
                    <span className="font-medium">{preset.name}</span>
                    <span className="text-xs text-gray-500">
                      {preset.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
        </div>

        {/* 样式设置 */}
        <div className="flex gap-2 items-center">
          <label className="flex gap-1 items-center">
            <input
              type="checkbox"
              checked={preserveStyle}
              onChange={(e) => setPreserveStyle(e.target.checked)}
            />
            保持 SVG 原始样式
          </label>
        </div>

        {/* 导出按钮 */}
        {mode === "single" ? (
          <button
            className="py-2 mt-2 w-full font-bold text-white bg-blue-600 rounded transition hover:bg-blue-700"
            onClick={handleExport}
          >
            导出当前 PNG
          </button>
        ) : (
          <button
            className="py-2 mt-2 w-full font-bold text-white bg-green-600 rounded transition hover:bg-green-700"
            onClick={handleBatchExport}
            disabled={svgFiles.length === 0}
          >
            批量导出所有 PNG
          </button>
        )}

        {/* 错误提示 */}
        {error && (
          <div
            className={`mt-1 text-sm ${
              error.includes("导出完成") ? "text-green-500" : "text-red-500"
            }`}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
