import React, { useState, useEffect } from "react";
import axios from "axios";
import fileAPI from "../services/fileAPI";
import "../cssFiles/RecordsList.css";

// ===== Full-page PDF Preview (video style) =====
function FullPagePdfModal({ open, onClose, fileName, base64, contentType }) {
  if (!open) return null;

  const dataUrl = `data:${contentType};base64,${base64}`;

  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal-content">
        {/* Header: PDF name + cross */}
        <div className="pdf-modal-header">
          <span className="pdf-modal-name">{fileName}</span>
          <button className="pdf-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* PDF view without toolbar */}
        <iframe
          src={`${dataUrl}#toolbar=0`}
          className="pdf-modal-iframe"
          title={fileName}
        />
      </div>
    </div>
  );
}

// ===== Full-page Video Preview =====
function FullPageVideoModal({ open, onClose, fileName, base64, contentType }) {
  if (!open) return null;

  const videoSrc = `data:${contentType};base64,${base64}`;

  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal-content">
        {/* Header */}
        <div className="pdf-modal-header">
          <span className="pdf-modal-name">{fileName}</span>
          <button className="pdf-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Video */}
        <video className="pdf-modal-video" controls autoPlay>
          <source src={videoSrc} type={contentType} />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

// ===== MIME type helper =====
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
    avi: "video/x-msvideo",
  };
  return typeMap[fileType?.toLowerCase()] || "application/octet-stream";
};

// ===== Main RecordsList Component =====
export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Preview state
  const [openPdf, setOpenPdf] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
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

      // detect file type and open accordingly
      if (mimeType.startsWith("video/")) {
        setOpenVideo(true);
      } else if (mimeType === "application/pdf") {
        setOpenPdf(true);
      } else {
        alert("Only video and PDF preview supported for now!");
      }
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

      {/* PDF and Video Modals */}
      <FullPagePdfModal
        open={openPdf}
        onClose={() => setOpenPdf(false)}
        fileName={fileName}
        base64={base64}
        contentType={contentType}
      />

      <FullPageVideoModal
        open={openVideo}
        onClose={() => setOpenVideo(false)}
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









