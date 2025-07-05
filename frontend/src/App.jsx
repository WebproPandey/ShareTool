import React from "react";
import DropZone from "./components/DropZone";
import ClipboardPaste from "./components/ClipboardPaste";
import FileReceiver from "./components/FileReceiver";

const App = () => {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">ShareIt</h1>
      <DropZone />
      <ClipboardPaste />
      <FileReceiver/>
    </div>
  );
};

export default App;
