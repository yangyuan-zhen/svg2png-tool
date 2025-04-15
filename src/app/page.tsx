"use client";
import Svg2PngTool from "@/components/Svg2PngTool";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">SVG 转 PNG 工具</h1>
        <Svg2PngTool />
      </div>
      <footer className="mt-8 text-gray-400 text-xs text-center">
        © {new Date().getFullYear()} SVG2PNG Tool
      </footer>
    </main>
  );
}
