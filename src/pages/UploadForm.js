import React, { useState } from "react";
import fileAPI from "../services/fileAPI";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    patient_id: "",
    admission_id: "",
    hospital_id: "",
    document_type: "",
    remarks: "",
    doctor_id: "",
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("action_mode", "upload"); // backend expect করে
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("file", file, file.name);

    try {
      const res = await fileAPI.submitRecordWithFile(data);
      console.log("Upload Success:", res.data);
      setMessage("File uploaded successfully!");
    } catch (err) {
      console.error("Upload Failed:", err);
      setMessage("Upload failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
      <input
        type="number"
        name="patient_id"
        value={formData.patient_id}
        onChange={handleChange}
        placeholder="Patient ID"
        required
      />
      <input
        type="number"
        name="admission_id"
        value={formData.admission_id}
        onChange={handleChange}
        placeholder="Admission ID"
        required
      />
      <input
        type="number"
        name="hospital_id"
        value={formData.hospital_id}
        onChange={handleChange}
        placeholder="Hospital ID"
        required
      />
      <select
        name="document_type"
        value={formData.document_type}
        onChange={handleChange}
        required
      >
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
      <textarea
        name="remarks"
        value={formData.remarks}
        onChange={handleChange}
        placeholder="Remarks"
      />
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UploadForm;
