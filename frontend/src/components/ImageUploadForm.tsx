interface ImageUploadFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export const ImageUploadForm = ({ onSubmit }: ImageUploadFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget));
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label htmlFor="fileInput">Upload an image:</label>
      <input
        name="photo"
        id="fileInput"
        type="file"
        accept="image/png, image/jpeg"
      />
      <label htmlFor="nameInput">Image Name:</label>
      <input
        name="name"
        id="nameInput"
        type="text"
        placeholder="Enter image name"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
