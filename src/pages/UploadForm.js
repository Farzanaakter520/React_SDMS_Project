import React, { useState } from "react";
import fileAPI from "../services/fileAPI";
import '../cssFiles/UploadForm.css';

export default function PostOpDocs() {
  const [formData, setFormData] = useState({
    patient_id: "",
    admission_id: "",
    hospital_id: "",
    doctor_id: "",
    document_type: "",
    remarks: "",
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return setMessage("Please select at least one file");

    const data = new FormData();
    data.append("action_mode", "add"); // ✅ Add this for backend
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    for (let i = 0; i < files.length; i++) data.append("files", files[i]);

    try {
      const res = await fileAPI.submitRecordWithFile(data);
      console.log("Upload Success:", res);
      if(res.success){
        setMessage("Files uploaded successfully!");
        setFormData({
          patient_id: "",
          admission_id: "",
          hospital_id: "",
          doctor_id: "",
          document_type: "",
          remarks: "",
        });
        setFiles([]);
      } else {
        setMessage(res.msg || "Upload failed!");
      }
    } catch (err) {
      console.error("Upload Failed:", err);
      setMessage("Upload failed!");
    }
  };

  return (
    <div className="postopdocs-container">
      <div className="upload-container">
        <h2 className="upload-title">Upload Post-Op Documents</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <input type="number" name="patient_id" value={formData.patient_id} onChange={handleChange} placeholder="Patient ID" required />
          <input type="number" name="admission_id" value={formData.admission_id} onChange={handleChange} placeholder="Admission ID" required />
          <input type="number" name="hospital_id" value={formData.hospital_id} onChange={handleChange} placeholder="Hospital ID" required />
          <input type="number" name="doctor_id" value={formData.doctor_id} onChange={handleChange} placeholder="Doctor ID" required />
          <select name="document_type" value={formData.document_type} onChange={handleChange} required>
            <option value="">--Select Document Type--</option>
            <option value="x-ray">X-Ray</option>
            <option value="diagnostic_report">Diagnostic Report</option>
            <option value="prescription">Prescription</option>
            <option value="consent_form">Consent Form</option>
            <option value="surgical_note">Surgical Note</option>
            <option value="pathological">Pathological</option>
            <option value="imaging">Imaging</option>
            <option value="other">Other</option>
          </select>
          <textarea name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Remarks" />
          <input type="file" multiple onChange={handleFileChange} required />
          <button type="submit">Upload</button>
        </form>
        {message && <p className="upload-message">{message}</p>}
      </div>
    </div>
  );
}





// // UploadForm.js
// import React, { useState } from "react";
// import fileAPI from "../services/fileAPI";
// import '../cssFiles/UploadForm.css';

// export default function UploadForm() {
//   const [formData, setFormData] = useState({
//     patient_id: "",
//     admission_id: "",
//     hospital_id: "",
//     doctor_id: "",
//     document_type: "",
//     remarks: "",
//   });
//   const [files, setFiles] = useState([]);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
//   const handleFileChange = (e) => setFiles(e.target.files);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!files.length) return setMessage("Please select at least one file");

//     try {
//       const data = new FormData();
//       Object.keys(formData).forEach(key => data.append(key, formData[key]));
//       for (let i = 0; i < files.length; i++) data.append("files", files[i]);

//       const res = await fileAPI.submitRecordWithFile(data);
//       console.log("Upload Success:", res);
//       if (res.success) {
//         setMessage(`${files.length} file(s) uploaded successfully!`);
//         setFormData({
//           patient_id: "",
//           admission_id: "",
//           hospital_id: "",
//           doctor_id: "",
//           document_type: "",
//           remarks: "",
//         });
//         setFiles([]);
//       } else {
//         setMessage("Upload failed: " + (res.msg || "Unknown error"));
//       }
//     } catch (err) {
//       console.error("Upload Failed:", err);
//       setMessage("Upload failed! See console for details.");
//     }
//   };

//   return (
//     <div className="upload-container">
//       <h2 className="upload-title">Upload Post-Op Documents</h2>
//       <form onSubmit={handleSubmit} className="upload-form">
//         <input type="number" name="patient_id" value={formData.patient_id} onChange={handleChange} placeholder="Patient ID" required />
//         <input type="number" name="admission_id" value={formData.admission_id} onChange={handleChange} placeholder="Admission ID" required />
//         <input type="number" name="hospital_id" value={formData.hospital_id} onChange={handleChange} placeholder="Hospital ID" required />
//         <input type="number" name="doctor_id" value={formData.doctor_id} onChange={handleChange} placeholder="Doctor ID" required />
//         <select name="document_type" value={formData.document_type} onChange={handleChange} required>
//           <option value="">--Select Document Type--</option>
//           <option value="x-ray">X-Ray</option>
//           <option value="diagnostic_report">Diagnostic Report</option>
//           <option value="prescription">Prescription</option>
//           <option value="consent_form">Consent Form</option>
//           <option value="surgical_note">Surgical Note</option>
//           <option value="pathological">Pathological</option>
//           <option value="imaging">Imaging</option>
//           <option value="other">Other</option>
//         </select>
//         <textarea name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Remarks" />
//         <input type="file" multiple onChange={handleFileChange} required />
//         <button type="submit">Upload</button>
//       </form>
//       {message && <p className="upload-message">{message}</p>}
//     </div>
//   );
// }
