import React from "react";
import { uploadFile } from "../api";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [dragOver, setDragOver] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const nav = useNavigate();

  React.useEffect(() => {
    // no-op
  }, []);

  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((f) => f.concat(dropped));
  };

  const doUpload = async () => {
    if (!files.length) return alert("Pick files first");
    setUploading(true);
    try {
      for (const f of files) {
        // upload as-is; you can set custom name by creating new File([...], "folder/name.ext")
        await uploadFile(f);
      }
      alert("Uploaded");
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <h2>Upload files</h2>

      <div
        className={`dropzone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <p>Drag & drop files here, or click to choose</p>
        <input type="file" multiple onChange={onFileChange} />
      </div>

      <div className="picked">
        <h4>Files:</h4>
        <ul>
          {files.map((f, i) => <li key={i}>{f.name} — {Math.round(f.size/1024)} KB</li>)}
        </ul>
      </div>

      <div>
        <button onClick={doUpload} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
      </div>
    </div>
  );
}
