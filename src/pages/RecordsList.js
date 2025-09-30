import React, { useEffect, useState } from "react";
import fileAPI from "../services/fileAPI";
import "./RecordsList.css";

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleOpenDownload = async (r) => {
    try {
      const blob = await fileAPI.downloadFileById(r.id || r._id, r.patient_id, r.admission_id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
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
    <div className="records-container">
      <h2>Records</h2>
      {loading ? (
        <div style={{ textAlign: "center", padding: "1rem" }}>Loading...</div>
      ) : (
        <table className="records-table">
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
                  <button
                    className="action-btn"
                    onClick={() => handleOpenDownload(r)}
                  >
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
