import React, { useEffect, useState } from "react";
import axios from "axios";
import fileAPI from "../services/fileAPI";
import "../cssFiles/RecordsList.css";

// Full-page preview (alert-style modal)
function FullPagePreview({ open, onClose, fileName, base64, contentType }) {
  if (!open) return null;

  const dataUrl = `data:${contentType};base64,${base64}`;

  return (
    <div className="fullpage-overlay" onClick={onClose}>
      <div
        className="fullpage-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2 text-gray-800 text-2x2 font-semibold">
          <h2 className="text-2xl font-semibold text-gray-800">{fileName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* File Preview */}
        <div className="pdf-preview-area">
          {contentType === "application/pdf" ? (
            <iframe
              src={dataUrl}
              className="pdf-full-view"
              title={fileName}
            />
          ) : contentType.startsWith("image/") ? (
            <img src={dataUrl} alt={fileName} className="img-full-view" />
          ) : contentType.startsWith("video/") ? (
            <video src={dataUrl} controls className="img-full-view" />
          ) : (
            <object data={dataUrl} type={contentType} className="pdf-full-view">
              <p className="text-gray-500 text-sm">
                Cannot preview this file type.
              </p>
            </object>
          )}
        </div>
      </div>
    </div>
  );
}

// MIME type helper
const getContentType = (fileType) => {
  const typeMap = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
    mp3: "audio/mpeg",
  };
  return typeMap[fileType?.toLowerCase()] || "application/octet-stream";
};

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Preview state
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [base64, setBase64] = useState(null);
  const [contentType, setContentType] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fileAPI.listRecords();
      if (res.success && res.data) {
        const grouped = {};
        res.data.forEach((item) => {
          const key = `${item.patient_id}_${item.admission_id}`;
          if (!grouped[key]) grouped[key] = { ...item, files: [] };
          grouped[key].files.push({
            drive_file_id: item.drive_file_id,
            file_name: item.file_name,
            file_type: item.file_type,
          });
        });
        setRecords(Object.values(grouped));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch records from backend");
    } finally {
      setLoading(false);
    }
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const handlePreviewFile = async (file) => {
    if (!file.drive_file_id) return alert("File ID missing!");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/fileupload/fileuploadapi/preview",
        { drive_file_id: file.drive_file_id },
        { responseType: "blob" }
      );

      const mimeType = getContentType(file.file_type);
      const base64Data = await blobToBase64(response.data);

      setFileName(file.file_name);
      setContentType(mimeType);
      setBase64(base64Data);
      setOpen(true);
    } catch (error) {
      console.error(error);
      alert("Preview failed");
    }
  };

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
          {records.map((record, idx) => (
            <tr key={record.patient_id + "_" + record.admission_id}>
              <td>{idx + 1}</td>
              <td>{record.patient_id}</td>
              <td>{record.admission_id}</td>
              <td>{record.hospital_id}</td>
              <td>{record.doctor_id}</td>
              <td>{record.document_type}</td>
              <td>{record.remarks}</td>
              <td>
                {record.files.map((file) => (
                  <button
                    key={file.drive_file_id}
                    onClick={() => handlePreviewFile(file)}
                    className="action-btn"
                  >
                     {file.file_name}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <FullPagePreview
        open={open}
        onClose={() => setOpen(false)}
        fileName={fileName}
        base64={base64}
        contentType={contentType}
      />
    </div>
  );
}
















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import fileAPI from "../services/fileAPI";
// import "../cssFiles/RecordsList.css";

// export default function RecordsList() {
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchRecords = async () => {
//     setLoading(true);
//     try {
//       const res = await fileAPI.listRecords();
//       if (res.success && res.data) {
//         const grouped = {};

//         // Group by patient_id + admission_id
//         res.data.forEach((item) => {
//           const key = `${item.patient_id}_${item.admission_id}`;
//           if (!grouped[key]) grouped[key] = { ...item, files: [] };

//           grouped[key].files.push({
//             drive_file_id: item.drive_file_id,
//             file_name: item.file_name,
//             file_type: item.file_type, // important for preview type
//           });
//         });

//         setRecords(Object.values(grouped));
//       }
//     } catch (err) {
//       console.error("Fetch Records Failed:", err);
//       alert("Failed to fetch records from backend");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Preview function for PDF, video, image
//   const handlePreviewFile = async (file) => {
//     if (!file.drive_file_id) return alert("File ID missing!");

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/api/v1/fileupload/fileuploadapi/preview",
//         { drive_file_id: file.drive_file_id },
//         { responseType: "blob" }
//       );

//       let mimeType = "application/octet-stream"; // fallback

//       if (file.file_type === "pdf") mimeType = "application/pdf";
//       else if (file.file_type === "mp4") mimeType = "video/mp4";
//       else if (file.file_type === "mov") mimeType = "video/quicktime";
//       else if (file.file_type === "avi") mimeType = "video/x-msvideo";
//       else if (file.file_type === "mkv") mimeType = "video/x-matroska";
//       else if (file.file_type === "jpg" || file.file_type === "jpeg")
//         mimeType = "image/jpeg";
//       else if (file.file_type === "png") mimeType = "image/png";

//       const blob = new Blob([response.data], { type: mimeType });
//       const url = window.URL.createObjectURL(blob);
//       window.open(url, "_blank");

//       // Optional: revoke after 10 seconds
//       setTimeout(() => window.URL.revokeObjectURL(url), 10000);
//     } catch (error) {
//       console.error("Preview Error:", error);
//       alert("Preview failed");
//     }
//   };

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
//   if (!records.length) return <p style={{ textAlign: "center" }}>No records found</p>;

//   return (
//     <div className="records-container">
//       <h2>Patient Records</h2>
//       <table className="records-table">
//         <thead>
//           <tr>
//             <th>Serial</th>
//             <th>Patient ID</th>
//             <th>Admission ID</th>
//             <th>Hospital ID</th>
//             <th>Doctor ID</th>
//             <th>Document Type</th>
//             <th>Remarks</th>
//             <th>Files</th>
//           </tr>
//         </thead>
//         <tbody>
//           {records.map((record, index) => (
//             <tr key={record.patient_id + "_" + record.admission_id}>
//               <td>{index + 1}</td>
//               <td>{record.patient_id}</td>
//               <td>{record.admission_id}</td>
//               <td>{record.hospital_id}</td>
//               <td>{record.doctor_id}</td>
//               <td>{record.document_type}</td>
//               <td>{record.remarks}</td>
//               <td>
//                 {record.files && record.files.length > 0 ? (
//                   record.files.map((file) => (
//                     <button
//                       key={file.drive_file_id}
//                       onClick={() => handlePreviewFile(file)}
//                       className="download-btn"
//                     >
//                       👁️ {file.file_name}
//                     </button>
//                   ))
//                 ) : (
//                   <span>No Files</span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }









