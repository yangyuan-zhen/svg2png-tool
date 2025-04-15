"use client";
import Svg2PngTool from "@/components/Svg2PngTool";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center p-4 min-h-screen bg-gray-50">
      <div className="p-6 w-full max-w-lg bg-white rounded-xl shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-center">SVG 转 PNG 工具</h1>
        <Svg2PngTool />
      </div>
      <footer className="mt-8 text-xs text-center text-gray-400">
        © {new Date().getFullYear()} SVG2PNG Tool
      </footer>
    </main>
  );
}
