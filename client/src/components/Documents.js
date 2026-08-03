import React, { useState, useEffect } from 'react';
import './Documents.css';

const Documents = ({ userId }) => {
  const [documents, setDocuments] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    documentType: '',
    file: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents/user/${userId}`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const uploadFormData = new FormData();
    uploadFormData.append('document', formData.file);
    uploadFormData.append('userId', userId);
    uploadFormData.append('serviceName', formData.serviceName);
    uploadFormData.append('documentType', formData.documentType);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          setFormData({ serviceName: '', documentType: '', file: null });
          setShowUploadForm(false);
          fetchDocuments();
        }
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('error', () => {
        console.error('Upload failed');
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', '/api/documents/upload');
      xhr.send(uploadFormData);
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await fetch(`/api/documents/${documentId}`, {
          method: 'DELETE',
        });
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      window.open(`/api/documents/download/${documentId}`, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="loading">Loading documents...</div>;
  }

  return (
    <div className="documents-container">
      <div className="documents-header">
        <h2>My Documents</h2>
        <button 
          className="upload-btn"
          onClick={() => setShowUploadForm(true)}
        >
          + Upload Document
        </button>
      </div>

      {showUploadForm && (
        <div className="upload-form-overlay">
          <div className="upload-form">
            <h3>Upload New Document</h3>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Document Type</label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="ID Proof">ID Proof</option>
                  <option value="Address Proof">Address Proof</option>
                  <option value="Income Certificate">Income Certificate</option>
                  <option value="Educational Certificate">Educational Certificate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Select File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  required
                />
              </div>
              
              {uploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span>{uploadProgress}%</span>
                </div>
              )}
              
              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowUploadForm(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="documents-grid">
        {documents.map((document) => (
          <div key={document._id} className="document-card">
            <div className="document-icon">
              📄
            </div>
            <div className="document-info">
              <h4>{document.fileName}</h4>
              <p className="document-meta">
                {document.serviceName} • {document.documentType}
              </p>
              <p className="document-size">
                {formatFileSize(document.fileSize)}
              </p>
              <p className="document-date">
                Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="document-actions">
              <button 
                className="download-btn"
                onClick={() => handleDownload(document._id, document.fileName)}
              >
                Download
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(document._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="empty-state">
          <p>No documents uploaded yet. Upload your first document!</p>
        </div>
      )}
    </div>
  );
};

export default Documents;
