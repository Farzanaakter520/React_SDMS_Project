import React, { useEffect, useState } from "react";
import fileAPI from "../services/fileAPI";
import '../cssFiles/RecordsList.css';

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fileAPI.listRecords(); // backend call
      if (res.success && res.data) {
        const grouped = {};

        // Group by patient_id + admission_id
        res.data.forEach(item => {
          const key = `${item.patient_id}_${item.admission_id}`;
          if (!grouped[key]) {
            grouped[key] = {
              ...item,
              files: []
            };
          }
          // push each file into files array
          grouped[key].files.push({
            fileId: item.drive_file_id,
            name: item.file_name,
            webViewLink: `https://drive.google.com/file/d/${item.drive_file_id}/view?usp=drivesdk`
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

  const handleOpenFile = (file) => {
    if (file.webViewLink) window.open(file.webViewLink, "_blank");
    else alert("No file link available");
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
                  record.files.map(file => (
                    <button
                      key={file.fileId}
                      onClick={() => handleOpenFile(file)}
                      style={{ display: "block", marginBottom: "5px", cursor: "pointer" }}
                    >
                      {file.name}
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
