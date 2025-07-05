// utils/webrtc.js
// WebRTC peer connection and file transfer logic for offline sharing
import socket from './socket';

let peerConnection;
let dataChannel;

export function createConnection(isInitiator, onData, onSignal, onClose) {
  peerConnection = new window.RTCPeerConnection();

  if (isInitiator) {
    dataChannel = peerConnection.createDataChannel('file');
    setupDataChannel(onData, onClose);
  } else {
    peerConnection.ondatachannel = (event) => {
      dataChannel = event.channel;
      setupDataChannel(onData, onClose);
    };
  }

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      onSignal({ type: 'candidate', candidate: event.candidate });
    }
  };

  return peerConnection;
}

function setupDataChannel(onData, onClose) {
  dataChannel.onmessage = (event) => {
    onData(event.data);
  };
  dataChannel.onclose = onClose;
}

export async function createOffer() {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
}

export async function createAnswer(offer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
}

export async function setRemoteAnswer(answer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

export function addIceCandidate(candidate) {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

export function sendFileChunk(chunk) {
  dataChannel.send(chunk);
}

export function closeConnection() {
  if (dataChannel) dataChannel.close();
  if (peerConnection) peerConnection.close();
}
