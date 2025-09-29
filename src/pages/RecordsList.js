import React, { useEffect, useState } from "react";
import fileAPI from "../services/fileAPI";

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch records
  const fetch = async () => {
    setLoading(true);
    try {
      const res = await fileAPI.listRecords();
      const data = res.data?.data || res.data;
      setRecords(Array.isArray(data) ? data : data.records || []);
    } catch (e) {
      console.error(e);
      alert("List fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // Backend API download/open
  const handleOpenDownload = async (r) => {
    try {
      // Call backend API
      const blob = await fileAPI.downloadFileById(r.id || r._id, r.patient_id, r.admission_id);

      // Create temporary URL and open in new tab
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;

      // Open in new tab for PDF preview
      a.target = "_blank";

      // Suggest download name
      a.download = r.file_name || "file.pdf";

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download/Open failed:", err);
      alert("Download/Open failed. Please check console.");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "1rem auto", padding: 20 }}>
      <h2>Records</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>File Name</th>
              <th>Patient ID</th>
              <th>Admission ID</th>
              <th>Hospital ID</th>
              <th>Doctor ID</th>
              <th>Document Type</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id || r._id}>
                <td>{r.id || r._id}</td>
                <td>{r.file_name}</td>
                <td>{r.patient_id}</td>
                <td>{r.admission_id}</td>
                <td>{r.hospital_id}</td>
                <td>{r.doctor_id}</td>
                <td>{r.document_type}</td>
                <td>{r.remarks}</td>
                <td>
                  <button onClick={() => handleOpenDownload(r)}>
                    Open / Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
