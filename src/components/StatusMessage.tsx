import React from "react";

export type StatusMessageProps = {
  message: string;
  type?: "error" | "success" | "info" | "warning";
};

export default function StatusMessage({
  message,
  type = "error",
}: StatusMessageProps) {
  if (!message) return null;

  let colorClass = "";
  let icon = null;

  switch (type) {
    case "success":
      colorClass = "text-green-600 bg-green-50 border-green-200";
      icon = (
        <svg
          className="w-5 h-5 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
    case "warning":
      colorClass = "text-yellow-600 bg-yellow-50 border-yellow-200";
      icon = (
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
    case "info":
      colorClass = "text-blue-600 bg-blue-50 border-blue-200";
      icon = (
        <svg
          className="w-5 h-5 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
    case "error":
    default:
      colorClass = "text-red-600 bg-red-50 border-red-200";
      icon = (
        <svg
          className="w-5 h-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
      break;
  }

  return (
    <div className={`flex p-3 mt-2 rounded border ${colorClass}`}>
      {icon && <div className="flex-shrink-0 mr-2">{icon}</div>}
      <div className="text-sm">{message}</div>
    </div>
  );
}
