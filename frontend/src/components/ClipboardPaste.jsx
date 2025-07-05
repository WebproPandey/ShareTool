// src/components/ClipboardPaste.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendFile } from "../app/features/file/fileSlice";

const ClipboardPaste = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handlePaste = async (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            dispatch(sendFile(file));
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [dispatch]);

  return (
    <div className="text-sm text-gray-500 mt-2 italic">
      📋 Paste any copied image/file using <strong>Ctrl+V</strong> / <strong>Cmd+V</strong>
    </div>
  );
};

export default ClipboardPaste;
