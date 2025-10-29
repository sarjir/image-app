import "./App.css";

export const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Uploading App</h1>
      </header>
      <main>
        <label htmlFor="fileInput">Upload an image:</label>
        <input id="fileInput" type="file" accept="image/png, image/jpeg" />
        <label htmlFor="nameInput">Image Name:</label>
        <input type="text" placeholder="Enter image name" />
        <button type="submit">Submit</button>
      </main>
    </div>
  );
};
