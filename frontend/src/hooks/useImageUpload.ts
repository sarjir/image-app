import { useState } from 'react';

type UploadState = 'idle' | 'success' | 'error';

export const useImageUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');

  const uploadImage = async (formData: FormData) => {
    try {
      const response = await fetch("http://localhost:3002/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setUploadState('success');
    } catch (error) {
      console.error("Error:", error);
      setUploadState('error');
    }
  };

  return {
    isSuccess: uploadState === 'success',
    isError: uploadState === 'error',
    uploadImage,
  };
};