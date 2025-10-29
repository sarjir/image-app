import "./App.css";

export const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Uploading App</h1>
      </header>
      <main>
        <form
          action="http://localhost:3002/images"
          method="POST"
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
      </main>
    </div>
  );
};
