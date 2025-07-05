import React, { useState, useRef, useEffect } from "react";
import socket from "../utils/socket";
import {
  createConnection,
  createOffer,
  createAnswer,
  setRemoteAnswer,
  addIceCandidate,
  sendFileChunk,
  closeConnection,
} from "../utils/webrtc";

const DropZone = () => {
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();
  const [peerId, setPeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);

  // Connect to peer (signaling)
  const connectToPeer = () => {
    setStatus("Connecting to peer...");
    const conn = createConnection(
      true,
      null,
      (signal) => {
        // Attach file metadata to offer if file is selected
        if (signal.type === "offer" && fileRef.current) {
          signal.offer.fileMeta = {
            name: fileRef.current.name,
            size: fileRef.current.size,
            type: fileRef.current.type,
          };
        }
        socket.emit("signal", { to: peerId, signal });
      },
      () => setStatus("Connection closed")
    );
    createOffer().then((offer) => {
      // Attach file metadata to offer if file is selected
      if (fileRef.current) {
        offer.fileMeta = {
          name: fileRef.current.name,
          size: fileRef.current.size,
          type: fileRef.current.type,
        };
      }
      socket.emit("signal", { to: peerId, signal: { type: "offer", offer } });
    });
    socket.on("signal", async ({ signal }) => {
      if (signal.type === "answer") {
        await setRemoteAnswer(signal.answer);
        setConnected(true);
        setStatus("Connected. Ready to send file.");
      } else if (signal.type === "candidate") {
        addIceCandidate(signal.candidate);
      }
    });
  };

  // Send file in chunks
  const sendFile = (file) => {
    setSending(true);
    setStatus("Sending file...");
    const chunkSize = 16 * 1024;
    let offset = 0;
    const reader = new FileReader();
    reader.onload = (e) => {
      sendFileChunk(e.target.result);
      offset += chunkSize;
      setProgress(Math.round((offset / file.size) * 100));
      if (offset < file.size) {
        readSlice(offset);
      } else {
        setStatus("File sent!");
        setSending(false);
        closeConnection();
      }
    };
    const readSlice = (o) => {
      const slice = file.slice(o, o + chunkSize);
      reader.readAsArrayBuffer(slice);
    };
    readSlice(0);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    fileRef.current = file;
    setStatus(`File ready: ${file.name}`);
  };

  const handleSend = () => {
    if (fileRef.current && connected) {
      sendFile(fileRef.current);
    }
  };

  return (
    <div
      className="w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 mb-4"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="text"
        placeholder="Enter Peer ID"
        value={peerId}
        onChange={(e) => setPeerId(e.target.value)}
        className="mb-2 p-1 border"
      />
      <button
        onClick={connectToPeer}
        disabled={!peerId || connected}
        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
      >
        Connect
      </button>
      <div className="text-gray-600 text-center mb-2 mt-2">
        📁 <strong>Drag & Drop</strong> file here
      </div>
      <div className="mt-2">{status}</div>
      <button
        onClick={handleSend}
        disabled={!fileRef.current || !connected || sending}
        className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
      >
        Send File
      </button>
      {progress > 0 && (
        <div className="w-4/5 bg-gray-200 rounded-full overflow-hidden h-4 mt-2">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default DropZone;
