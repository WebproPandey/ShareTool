import React, { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";
import {
  createConnection,
  createAnswer,
  addIceCandidate,
  closeConnection,
} from "../utils/webrtc";

const FileReceiver = () => {
  const [offer, setOffer] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [receiving, setReceiving] = useState(false);
  const [progress, setProgress] = useState(0);
  const receivedChunks = useRef([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [senderId, setSenderId] = useState("");

  useEffect(() => {
    socket.on("signal", async ({ from, signal }) => {
      if (signal.type === "offer") {
        setOffer(signal.offer);
        setSenderId(from);
        setFileMeta(signal.offer.fileMeta || null);
      } else if (signal.type === "candidate") {
        addIceCandidate(signal.candidate);
      }
    });
    return () => {
      socket.off("signal");
    };
  }, []);

  // Accept file transfer
  const handleAccept = async () => {
    setReceiving(true);
    const conn = createConnection(
      false,
      (data) => {
        receivedChunks.current.push(data);
        setProgress(
          Math.round(
            ((receivedChunks.current.length * 16 * 1024) / (fileMeta?.size || 1)) *
              100
          )
        );
        if (
          receivedChunks.current.length * 16 * 1024 >= (fileMeta?.size || 0)
        ) {
          const blob = new Blob(receivedChunks.current);
          setDownloadUrl(URL.createObjectURL(blob));
          setReceiving(false);
          closeConnection();
        }
      },
      (signal) => {
        socket.emit("signal", { to: senderId, signal });
      },
      () => setReceiving(false)
    );
    await createAnswer(offer);
  };

  const handleReject = () => {
    setOffer(null);
    setFileMeta(null);
    setReceiving(false);
    setProgress(0);
    receivedChunks.current = [];
    setDownloadUrl("");
  };

  if (!offer) return null;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-yellow-50">
      <h3 className="font-semibold text-lg text-yellow-800">📨 Incoming File</h3>
      {fileMeta && (
        <p className="text-sm mt-2 text-gray-700">
          <strong>Name:</strong> {fileMeta.name}
          <br />
          <strong>Type:</strong> {fileMeta.type}
          <br />
          <strong>Size:</strong> {fileMeta.size} bytes
        </p>
      )}
      {receiving ? (
        <div className="w-full bg-gray-300 h-3 rounded mt-4 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : downloadUrl ? (
        <a
          href={downloadUrl}
          download={fileMeta?.name || "file"}
          className="mt-4 block bg-blue-500 text-white px-4 py-2 rounded text-center"
        >
          Download File
        </a>
      ) : (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default FileReceiver;
