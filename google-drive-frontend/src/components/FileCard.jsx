import React from "react";
import { publicFileUrl, deleteFile, uploadFile } from "../api";

export default function FileCard({ file, onRefresh }) {
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [folder, setFolder] = React.useState("");
  const [desc, setDesc] = React.useState("");

  React.useEffect(() => {
    const stored = localStorage.getItem(`meta:${file.name}`);
    if (stored) setDesc(JSON.parse(stored).desc || "");
  }, [file.name]);

  const handleDelete = async () => {
    if (!confirm("Delete this file?")) return;
    setLoading(true);
    try {
      await deleteFile(file.name);
      onRefresh();
    } catch (e) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const url = publicFileUrl(file.name);
    window.open(url, "_blank");
  };

  // rename or move: download blob, create File with new name (optionally prefixed with folder/), upload, then delete old
  const handleRenameOrMove = async (isMove = false) => {
    const finalName = (folder ? `${folder}/${newName || stripPrefix(file.name)}` : (newName || stripPrefix(file.name)));
    if (!finalName) return alert("Please supply a new name");
    if (!confirm(`Proceed to ${isMove ? "move" : "rename"} to: ${finalName}?`)) return;

    setLoading(true);
    try {
      // fetch blob from public URL
      const url = publicFileUrl(file.name);
      const r = await fetch(url);
      if (!r.ok) throw new Error("Failed to download file for rename/move");
      const blob = await r.blob();
      // create new File object with the same MIME type
      const newFile = new File([blob], finalName, { type: blob.type });
      // upload
      await uploadFile(newFile);
      // delete old
      await deleteFile(file.name);
      onRefresh();
      alert("Done");
    } catch (err) {
      console.error(err);
      alert("Rename/move failed");
    } finally {
      setLoading(false);
      setEditing(false);
      setNewName("");
      setFolder("");
    }
  };

  const saveDesc = () => {
    localStorage.setItem(`meta:${file.name}`, JSON.stringify({ desc }));
    alert("Saved description locally");
  };

  return (
    <div className="file-card">
      <div className="file-info">
        <div className="file-name">{stripPrefix(file.name)}</div>
        <div className="file-meta">
          <button onClick={() => window.dispatchEvent(new CustomEvent('preview-file', { detail: file }))}>Preview</button>
          <button onClick={handleDownload}>Download</button>
          <button onClick={() => setEditing((s) => !s)}>{editing ? "Cancel" : "Rename/Move"}</button>
          <button onClick={handleDelete} disabled={loading}>{loading ? "..." : "Delete"}</button>
        </div>
      </div>

      {editing && (
        <div className="edit-area">
          <input placeholder="New name (include extension)" value={newName} onChange={(e)=>setNewName(e.target.value)} />
          <input placeholder="Folder (optional)" value={folder} onChange={(e)=>setFolder(e.target.value)} />
          <div>
            <button onClick={() => handleRenameOrMove(false)}>Rename (create new file)</button>
            <button onClick={() => handleRenameOrMove(true)}>Move (re-upload to folder)</button>
          </div>
        </div>
      )}

      <div className="desc-area">
        <textarea placeholder="Description (saved locally)" value={desc} onChange={(e)=>setDesc(e.target.value)} />
        <div><button onClick={saveDesc}>Save description</button></div>
      </div>
    </div>
  );
}

function stripPrefix(name) {
  return name?.replace(/^\d+-/, "") || name;
}
