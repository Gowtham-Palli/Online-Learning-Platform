import React, { useState } from 'react';

const ImageUploader = ({ onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        onImageUploaded(data.imageUrl);
      } else {
        alert(data?.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
    </div>
  );
};

export default ImageUploader;
