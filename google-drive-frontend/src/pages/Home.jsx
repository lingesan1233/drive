import React from "react";
import { listFiles, publicFileUrl } from "../api";
import FileCard from "../components/FileCard";
import PreviewModal from "../components/PreviewModal";

export default function Home() {
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [previewFile, setPreviewFile] = React.useState(null);
  const [query, setQuery] = React.useState("");

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await listFiles();
      // res.data is expected to be an array of objects from supabase storage list
      setFiles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert("Failed to load files");
    } finally { setLoading(false); }
  };

  React.useEffect(() => {
    fetchFiles();
    // listen to global preview event triggered in FileCard
    const handler = (e) => setPreviewFile(e.detail);
    window.addEventListener("preview-file", handler);
    return () => window.removeEventListener("preview-file", handler);
  }, []);

  const visible = files.filter(f => (f.name || "").toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="home-page">
      <div className="home-header">
        <h2>Your files</h2>
        <div>
          <input placeholder="Search" value={query} onChange={e=>setQuery(e.target.value)} />
          <button onClick={fetchFiles}>Refresh</button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="file-grid">
          {visible.length ? visible.map(f => (
            <FileCard key={f.name} file={f} onRefresh={fetchFiles} />
          )) : <p>No files</p>}
        </div>
      )}

      {previewFile && <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  );
}
