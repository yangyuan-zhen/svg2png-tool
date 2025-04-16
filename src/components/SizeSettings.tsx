import React from "react";

type Preset = {
  name: string;
  width: number;
  height: number;
  description?: string;
};

export type SizeSettingsProps = {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  aspectRatio?: number;
  lockAspectRatio?: boolean;
  onToggleAspectRatio?: () => void;
  presets?: Preset[];
  onPresetSelect?: (preset: Preset) => void;
};

export default function SizeSettings({
  width,
  height,
  onWidthChange,
  onHeightChange,
  aspectRatio = 0,
  lockAspectRatio = false,
  onToggleAspectRatio,
  presets = [],
  onPresetSelect,
}: SizeSettingsProps) {
  const defaultPresets: Preset[] = [
    { name: "16x16", width: 16, height: 16, description: "小型图标，favicon" },
    { name: "32x32", width: 32, height: 32, description: "标准图标" },
    { name: "64x64", width: 64, height: 64, description: "中型图标，APP图标" },
    { name: "128x128", width: 128, height: 128, description: "大型图标" },
    {
      name: "256x256",
      width: 256,
      height: 256,
      description: "高清图标，小型logo",
    },
    {
      name: "512x512",
      width: 512,
      height: 512,
      description: "标准logo，宣传图",
    },
  ];

  const allPresets = presets.length > 0 ? presets : defaultPresets;

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    onWidthChange(newWidth);

    // 如果启用了宽高比锁定，根据宽度自动计算高度
    if (lockAspectRatio && aspectRatio > 0) {
      onHeightChange(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    onHeightChange(newHeight);

    // 如果启用了宽高比锁定，根据高度自动计算宽度
    if (lockAspectRatio && aspectRatio > 0) {
      onWidthChange(Math.round(newHeight * aspectRatio));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="flex-1 mb-2 md:mb-0">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            宽度 (px)
          </label>
          <input
            type="number"
            min="1"
            value={width || ""}
            onChange={handleWidthChange}
            className="p-2 w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            高度 (px)
          </label>
          <input
            type="number"
            min="1"
            value={height || ""}
            onChange={handleHeightChange}
            className="p-2 w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {onToggleAspectRatio && (
        <div className="flex items-center">
          <input
            id="lock-aspect-ratio"
            type="checkbox"
            checked={lockAspectRatio}
            onChange={onToggleAspectRatio}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="lock-aspect-ratio"
            className="block ml-2 text-sm text-gray-700"
          >
            锁定宽高比
          </label>
        </div>
      )}

      {onPresetSelect && (
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium">预设尺寸</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onPresetSelect(preset)}
                className="flex flex-col items-center justify-center p-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors"
              >
                <span className="font-medium text-gray-800">{preset.name}</span>
                <span className="text-xs text-gray-500">
                  {preset.width}×{preset.height}
                </span>
                {preset.description && (
                  <span className="text-xs text-gray-600 mt-1 text-center">
                    {preset.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
