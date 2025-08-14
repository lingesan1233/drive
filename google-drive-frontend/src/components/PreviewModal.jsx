import React from "react";
import { publicFileUrl } from "../api";

export default function PreviewModal({ file, onClose }) {
  if (!file) return null;
  const url = publicFileUrl(file.name);

  const ext = (file.name || "").split(".").pop()?.toLowerCase() || "";
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);
  const isPdf = ext === "pdf";
  const isVideo = ["mp4", "webm", "ogg"].includes(ext);
  const isAudio = ["mp3", "wav", "ogg"].includes(ext);
  const isText = ["txt", "md", "json", "csv"].includes(ext);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{(file.name || "").replace(/^\d+-/, "")}</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          {isImage && <img src={url} alt={file.name} style={{ maxWidth: "100%" }} />}
          {isPdf && <iframe src={url} title={file.name} style={{ width: "100%", height: "80vh" }} />}
          {isVideo && <video controls src={url} style={{ maxWidth: "100%" }} />}
          {isAudio && <audio controls src={url} style={{ width: "100%" }} />}
          {isText && (
            <TextPreview url={url} />
          )}
          {!isImage && !isPdf && !isVideo && !isAudio && !isText && (
            <div>
              <p>No inline preview available.</p>
              <a href={url} target="_blank" rel="noreferrer">Open / Download</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TextPreview({ url }) {
  const [text, setText] = React.useState("Loading...");
  React.useEffect(() => {
    fetch(url).then(r => r.text()).then(setText).catch(() => setText("Unable to load text"));
  }, [url]);
  return <pre className="text-preview">{text}</pre>;
}
