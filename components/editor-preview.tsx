"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";

interface EditorPreviewProps {
  value: string;
}

export default function EditorPreview({ value }: EditorPreviewProps) {
  //Import react-quill package without server side rendering
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <div className="bg-white">
      <ReactQuill theme="bubble" value={value} readOnly />
    </div>
  );
}
