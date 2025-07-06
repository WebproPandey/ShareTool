import React, { useEffect, useState } from 'react';

export default function FileTransfer({ role, connectedTo, socket }) {
  const [file, setFile] = useState(null);
  const [receivedFile, setReceivedFile] = useState(null);
  const [transferStatus, setTransferStatus] = useState('');

  const handleSend = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("send-file", {
        to: connectedTo,
        fileName: file.name,
        fileData: reader.result,
      });
      setTransferStatus("Sending...");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    socket.on("receive-file", ({ fileName, fileData }) => {
      setReceivedFile({ fileName, fileData });
      setTransferStatus("File received!");
    });

    return () => {
      socket.off("receive-file");
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-white p-8 text-center">
      {role === "sender" ? (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Send File</h2>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 block mx-auto"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Send File
          </button>
          {transferStatus && (
            <div className="mt-4 text-green-600">{transferStatus}</div>
          )}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Waiting for File...</h2>
          {receivedFile ? (
            <div className="mt-4 bg-gray-100 p-4 rounded shadow">
              <p>📄 <strong>{receivedFile.fileName}</strong></p>
              <a
                href={receivedFile.fileData}
                download={receivedFile.fileName}
                className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download File
              </a>
            </div>
          ) : (
            <p className="text-gray-500">No file received yet.</p>
          )}
          {transferStatus && (
            <div className="mt-4 text-green-600">{transferStatus}</div>
          )}
        </div>
      )}
    </div>
  );
}
