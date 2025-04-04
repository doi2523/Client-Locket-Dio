import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    setUploadStatus("Uploading...");
  
    try {
      const response = await axios.post(
        "http://localhost:5000/webdio-20ca8/us-central1/uploadFile", 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      if (response.status === 200) {
        setUploadStatus(`File uploaded successfully! URL: ${response.data.fileUrl}`);
      } else {
        setUploadStatus(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file.");
    }
  };
  
  return (
    <div>
      <h2>Upload File</h2>
      <form id="uploadForm" encType="multipart/form-data" onSubmit={handleSubmit}>
        <input type="file" id="media" name="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default UploadForm;
