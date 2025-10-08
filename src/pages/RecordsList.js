import React, { useEffect, useState } from "react";
import axios from "axios";
import fileAPI from "../services/fileAPI";
import "../cssFiles/RecordsList.css";

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fileAPI.listRecords();
      if (res.success && res.data) {
        const grouped = {};

        // Group by patient_id + admission_id
        res.data.forEach((item) => {
          const key = `${item.patient_id}_${item.admission_id}`;
          if (!grouped[key]) grouped[key] = { ...item, files: [] };

          grouped[key].files.push({
            drive_file_id: item.drive_file_id,
            file_name: item.file_name,
            file_type: item.file_type, // important for preview type
          });
        });

        setRecords(Object.values(grouped));
      }
    } catch (err) {
      console.error("Fetch Records Failed:", err);
      alert("Failed to fetch records from backend");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Preview function for PDF, video, image
  const handlePreviewFile = async (file) => {
    if (!file.drive_file_id) return alert("File ID missing!");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/fileupload/fileuploadapi/preview",
        { drive_file_id: file.drive_file_id },
        { responseType: "blob" }
      );

      let mimeType = "application/octet-stream"; // fallback

      if (file.file_type === "pdf") mimeType = "application/pdf";
      else if (file.file_type === "mp4") mimeType = "video/mp4";
      else if (file.file_type === "mov") mimeType = "video/quicktime";
      else if (file.file_type === "avi") mimeType = "video/x-msvideo";
      else if (file.file_type === "mkv") mimeType = "video/x-matroska";
      else if (file.file_type === "jpg" || file.file_type === "jpeg")
        mimeType = "image/jpeg";
      else if (file.file_type === "png") mimeType = "image/png";

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Optional: revoke after 10 seconds
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Preview Error:", error);
      alert("Preview failed");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!records.length) return <p style={{ textAlign: "center" }}>No records found</p>;

  return (
    <div className="records-container">
      <h2>Patient Records</h2>
      <table className="records-table">
        <thead>
          <tr>
            <th>Serial</th>
            <th>Patient ID</th>
            <th>Admission ID</th>
            <th>Hospital ID</th>
            <th>Doctor ID</th>
            <th>Document Type</th>
            <th>Remarks</th>
            <th>Files</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.patient_id + "_" + record.admission_id}>
              <td>{index + 1}</td>
              <td>{record.patient_id}</td>
              <td>{record.admission_id}</td>
              <td>{record.hospital_id}</td>
              <td>{record.doctor_id}</td>
              <td>{record.document_type}</td>
              <td>{record.remarks}</td>
              <td>
                {record.files && record.files.length > 0 ? (
                  record.files.map((file) => (
                    <button
                      key={file.drive_file_id}
                      onClick={() => handlePreviewFile(file)}
                      className="download-btn"
                    >
                      👁️ {file.file_name}
                    </button>
                  ))
                ) : (
                  <span>No Files</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}










// import React, { useEffect, useState } from "react";
// import fileAPI from "../services/fileAPI";
// import "./RecordsList.css";

// export default function RecordsList() {
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchRecords = async () => {
//     setLoading(true);
//     try {
//       const res = await fileAPI.listRecords();
//       const data = res?.success && Array.isArray(res.data) ? res.data : [];
//       setRecords(data);
//     } catch (err) {
//       console.error("Fetch Records Failed:", err);
//       alert("Failed to fetch records from backend");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   const handleOpenDownload = (record) => {
//     if (record.drive_file_id) {
//       // Assuming file is in Google Drive
//       const url = `https://drive.google.com/file/d/${record.drive_file_id}/view?usp=sharing`;
//       window.open(url, "_blank");
//     } else {
//       alert("No file available");
//     }
//   };

//   return (
//     <div className="records-container">
//       <h2>Records</h2>
//       {loading ? (
//         <p style={{ textAlign: "center" }}>Loading...</p>
//       ) : (
//         <table className="records-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>File Name</th>
//               <th>Patient ID</th>
//               <th>Admission ID</th>
//               <th>Hospital ID</th>
//               <th>Doctor ID</th>
//               <th>Document Type</th>
//               <th>Remarks</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {records.map((r) => (
//               <tr key={r.id}>
//                 <td>{r.id}</td>
//                 <td>{r.file_name}</td>
//                 <td>{r.patient_id}</td>
//                 <td>{r.admission_id}</td>
//                 <td>{r.hospital_id}</td>
//                 <td>{r.doctor_id}</td>
//                 <td>{r.document_type}</td>
//                 <td>{r.remarks}</td>
//                 <td>
//                   {r.drive_file_id ? (
//                     <button onClick={() => handleOpenDownload(r)}>Open</button>
//                   ) : (
//                     "No File"
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
