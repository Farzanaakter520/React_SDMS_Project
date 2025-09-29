import React, { useEffect, useState } from "react";
import fileAPI from "../services/fileAPI";

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

  const handleDownload = async (r) => {
    try {
      const res = await fileAPI.downloadFileById(r.id || r._id);
      const blob = res.data;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = r.originalName || r.name || "file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      if (r.driveLink) {
        window.open(r.driveLink, "_blank");
      } else {
        alert("Download failed");
      }
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
              <th>Drive Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id || r._id}>
                <td>{r.id || r._id}</td>
                <td>{r.originalName || r.name}</td>
                <td>{r.patient_id}</td>
                <td>{r.admission_id}</td>
                <td>{r.hospital_id}</td>
                <td>{r.doctor_id}</td>
                <td>{r.document_type}</td>
                <td>{r.remarks}</td>
                <td>
                  {r.driveLink ? (
                    <a href={r.driveLink} target="_blank" rel="noreferrer">
                      Open in Drive
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <button onClick={() => handleDownload(r)}>
                    Download / Open
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



//backup
/*import React, { useEffect, useState } from 'react';
import fileAPI from '../services/fileAPI';

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await fileAPI.listRecords();
      const data = res.data?.data || res.data;
      setRecords(Array.isArray(data) ? data : (data.records || []));
    } catch (e) {
      console.error(e);
      alert('List fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDownload = async (r) => {
    try {
      const res = await fileAPI.downloadFileByRecordId(r.id || r._id);
      const blob = res.data;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = r.originalName || r.name || 'file';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      if (r.driveLink) {
        window.open(r.driveLink, '_blank');
      } else {
        alert('Download failed');
      }
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '1rem auto', padding: 20 }}>
      <h2>Records</h2>
      {loading ? <div>Loading...</div> : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Patient</th>
              <th>Drive Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id || r._id}>
                <td>{r.id || r._id}</td>
                <td>{r.originalName || r.name}</td>
                <td>{r.patientName || r.otherFields?.patientName}</td>
                <td>
                  {r.driveLink ? <a href={r.driveLink} target="_blank" rel="noreferrer">Open in Drive</a> : '—'}
                </td>
                <td>
                  <button onClick={() => handleDownload(r)}>Download / Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
*/