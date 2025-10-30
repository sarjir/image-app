import { useState } from "react";
import "./App.css";

export const App = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  async function sendFormData(formData: FormData) {
    try {
      const response = await fetch("http://localhost:3002/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setIsSuccess(true); // TODO: reset after some time
    } catch (error) {
      console.error("Error:", error); // TODO: Fix proper logging
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Uploading App</h1>
      </header>
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendFormData(new FormData(e.currentTarget));
          }}
          encType="multipart/form-data"
        >
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
        {isSuccess && <p>Image uploaded successfully! 🎉</p>}
      </main>
    </div>
  );
};
