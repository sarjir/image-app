import { useState } from 'react';

type UploadStatus = 'idle' | 'loading' | 'success' | 'error';

export const useImageUpload = () => {
  const [status, setStatus] = useState<UploadStatus>('idle');

  const uploadImage = async (formData: FormData) => {
    try {
      setStatus('loading');
      const response = await fetch("http://localhost:3002/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setStatus('success');
    } catch (error) {
      console.error("Error:", error);
      setStatus('error');
    }
  };

  return {
    isSuccess: status === 'success',
    isError: status === 'error',
    isLoading: status === 'loading',
    uploadImage,
  };
};