import React, { useRef, useState } from "react";
import { saveAs } from "file-saver";
import { Canvg } from "canvg";
import ModeSelector, { Mode } from "./ModeSelector";
import FileUploader from "./FileUploader";
import CodeEditor from "./CodeEditor";
import SvgPreview from "./SvgPreview";
import SizeSettings from "./SizeSettings";
import StyleOptions from "./StyleOptions";
import ExportButton from "./ExportButton";
import StatusMessage from "./StatusMessage";

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
  const [statusType, setStatusType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");
  const [mode, setMode] = useState<Mode>("single");
  const [preserveStyle, setPreserveStyle] = useState<boolean>(true);
  const [showSizePresets, setShowSizePresets] = useState<boolean>(false);
  const [svgFiles, setSvgFiles] = useState<File[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);

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

  // 显示状态消息
  const showMessage = (
    message: string,
    type: "error" | "success" | "info" | "warning" = "error"
  ) => {
    setError(message);
    setStatusType(type);

    // 如果是成功消息，3秒后自动清除
    if (type === "success") {
      setTimeout(() => setError(""), 3000);
    }
  };

  // 处理模式变更
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };

  // 处理文件上传
  const handleFileUpload = (file: File) => {
    const files = [file];
    setSvgFiles(files);

    // 读取SVG内容
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setSvgCode(content);
        parseSvgSize(content);
      }
    };
    reader.readAsText(file);

    setError("");
  };

  // 批量上传文件
  const handleFilesUpload = (files: File[]) => {
    setSvgFiles(files);

    // 如果上传了多个文件，自动切换到批量模式
    if (files.length > 1) {
      setMode("batch");
    }

    // 默认显示第一个SVG内容
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          setSvgCode(content);
          parseSvgSize(content);
        }
      };
      reader.readAsText(files[0]);
    }

    setError("");
  };

  // 处理SVG代码变更
  const handleSvgCodeChange = (newCode: string) => {
    setSvgCode(newCode);
    parseSvgSize(newCode);
    setError("");
  };

  // 处理清除队列
  const handleClearQueue = () => {
    setSvgFiles([]);
    setSvgCode("");
    setError("");
    setWidth(300);
    setHeight(300);
    setOriginRatio(1);
    setMode("single");
  };

  // 处理尺寸预设选择
  const handlePresetSelect = (preset: { width: number; height: number }) => {
    setWidth(preset.width);
    setHeight(preset.height);
    if (keepRatio) {
      setOriginRatio(preset.width / preset.height);
    }
    setShowSizePresets(false);
  };

  // 切换保持宽高比
  const handleToggleAspectRatio = () => {
    setKeepRatio(!keepRatio);
    if (!keepRatio) {
      // 如果要开启宽高比，根据当前宽高重新计算比例
      setOriginRatio(width / height);
    }
  };

  // 导出当前 PNG
  const handleExport = async () => {
    try {
      if (!svgCode.trim()) {
        showMessage("请先上传或粘贴 SVG", "error");
        return;
      }
      setError("");
      setIsExporting(true);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        showMessage("Canvas 初始化失败", "error");
        setIsExporting(false);
        return;
      }
      const svgWithSize = overrideSvgSize(svgCode, width, height);
      try {
        const v = await Canvg.fromString(ctx, svgWithSize, {
          ignoreAnimation: true,
        });
        await v.render();
      } catch (e) {
        showMessage(
          "SVG 渲染失败: " + (e instanceof Error ? e.message : e),
          "error"
        );
        setIsExporting(false);
        return;
      }
      canvas.toBlob((blob) => {
        if (!blob) {
          showMessage("PNG 导出失败: Canvas.toBlob 返回空", "error");
          setIsExporting(false);
          return;
        }
        saveAs(blob, "export.png");
        showMessage("导出成功！", "success");
        setIsExporting(false);
      }, "image/png");
    } catch (e) {
      showMessage("导出异常: " + (e instanceof Error ? e.message : e), "error");
      setIsExporting(false);
    }
  };

  // 批量导出 PNG
  const handleBatchExport = async () => {
    if (svgFiles.length === 0) {
      showMessage("请先上传 SVG 文件", "error");
      return;
    }

    setError("");
    setIsExporting(true);
    showMessage("正在导出...", "info");

    try {
      for (let i = 0; i < svgFiles.length; i++) {
        const file = svgFiles[i];
        const text = await file.text();
        // 对每个SVG都应用尺寸设置
        const svgWithSize = overrideSvgSize(text, width, height);

        // 更新进度
        showMessage(
          `正在处理 ${i + 1}/${svgFiles.length}: ${file.name}`,
          "info"
        );

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
      showMessage(`导出完成！成功导出 ${svgFiles.length} 个文件`, "success");
    } catch (e) {
      showMessage("导出异常: " + (e instanceof Error ? e.message : e), "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 模式选择器 */}
      <div className="mb-2">
        <ModeSelector mode={mode} onModeChange={handleModeChange} />
      </div>

      {/* 文件上传 */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="mb-2 text-lg font-medium">SVG 文件上传</h3>
        <div className="mb-4">
          <FileUploader
            onFileUpload={handleFileUpload}
            onSvgContentChange={handleSvgCodeChange}
            accept=".svg"
            multiple={mode === "batch"}
          />

          {/* 文件队列和清除按钮 */}
          {svgFiles.length > 0 && (
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-600">
                已选择 {svgFiles.length} 个文件
              </div>
              <button
                className="px-3 py-1 text-sm text-white bg-red-500 rounded transition hover:bg-red-600"
                onClick={handleClearQueue}
              >
                清除队列
              </button>
            </div>
          )}
        </div>

        {/* 代码编辑器 - 仅在单个模式下显示 */}
        {mode === "single" && (
          <div className="mb-4">
            <CodeEditor
              value={svgCode}
              onChange={handleSvgCodeChange}
              placeholder="在此粘贴 SVG 代码或上传 SVG 文件"
            />
          </div>
        )}
      </div>

      {/* SVG 预览 - 仅在单个模式下显示 */}
      {mode === "single" && svgCode && (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">SVG 预览</h3>
          <SvgPreview
            svgContent={svgCode}
            width={width}
            height={height}
            keepAspectRatio={keepRatio}
            error={error}
          />
        </div>
      )}

      {/* 尺寸设置 */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="mb-2 text-lg font-medium">导出设置</h3>
        <div className="mb-4">
          <SizeSettings
            width={width}
            height={height}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
            aspectRatio={originRatio}
            lockAspectRatio={keepRatio}
            onToggleAspectRatio={handleToggleAspectRatio}
            presets={SIZE_PRESETS}
            onPresetSelect={handlePresetSelect}
          />
        </div>

        {/* 样式设置 */}
        <div className="pt-4 mt-4 border-t">
          <StyleOptions
            preserveStyle={preserveStyle}
            onPreserveStyleChange={setPreserveStyle}
          />
        </div>
      </div>

      {/* 导出按钮和状态信息 */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <ExportButton
          mode={mode}
          onExport={mode === "single" ? handleExport : handleBatchExport}
          isExporting={isExporting}
          fileCount={svgFiles.length}
          disabled={
            (mode === "single" && !svgCode.trim()) ||
            (mode === "batch" && svgFiles.length === 0)
          }
        />

        {/* 错误/状态信息 */}
        {error && <StatusMessage message={error} type={statusType} />}
      </div>
    </div>
  );
}
