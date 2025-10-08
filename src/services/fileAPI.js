import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/fileupload/fileuploadapi/';

const submitRecordWithFile = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

const listRecords = async () => {
  try {
    const response = await axios.post(API_URL, { action_mode: 'getlist' });
    return response.data;
  } catch (error) {
    console.error('List Error:', error.response?.data || error.message);
    throw error;
  }
};

const downloadFileById = async (file_id, patient_id, admission_id) => {
  try {
    const response = await axios.post(
      API_URL,
      { action_mode: 'download-single', file_id, patient_id, admission_id },
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    console.error('Download Error:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ New preview function
const previewFileById = (drive_file_id) => {
  try {
    const previewLink = `${API_URL}preview?file_id=${drive_file_id}`;
    window.open(previewLink, "_blank"); 
  } catch (error) {
    console.error("Preview Error:", error);
    throw error;
  }
};


const fileAPI = {
  submitRecordWithFile,
  listRecords,
  downloadFileById,
  previewFileById, // <-- add this
};

export default fileAPI;
