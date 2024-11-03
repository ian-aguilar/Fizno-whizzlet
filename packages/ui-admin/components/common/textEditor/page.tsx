"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic from next/dynamic
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  label: string;
  className?: string;
  value?: string;
  onChange?: (e: string) => void;
}

const ReactQuillWithNoSSR = dynamic(() => import("react-quill"), {
  ssr: false,
});

const TextEditor: React.FC<TextEditorProps> = ({
  label,
  className,
  value,
  onChange,
  ...rest
}) => {
  return (
    <div>
      <label
        className={`block text-zinc-600 text-sm font-bold mb-1 ${className}`}
        htmlFor={label}
      >
        {label}
      </label>
      <ReactQuillWithNoSSR // Use the dynamic component
        className="border border-slate-200"
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
export default TextEditor;
