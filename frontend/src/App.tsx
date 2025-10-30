import "./App.css";
import { ImageUploadForm } from "./components/ImageUploadForm";
import { SuccessMessage } from "./components/SuccessMessage";
import { Header } from "./components/Header";
import { useImageUpload } from "./hooks/useImageUpload";

export const App = () => {
  const { isSuccess, uploadImage } = useImageUpload();

  return (
    <div className="App">
      <Header />
      <main>
        <ImageUploadForm onSubmit={uploadImage} />
        {isSuccess && <SuccessMessage />}
        {!isSuccess && <p>Failed to upload image. Please try again.</p>}
      </main>
    </div>
  );
};
