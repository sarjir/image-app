import "./App.css";
import { ImageUploadForm } from "./components/ImageUploadForm";
import { SuccessMessage } from "./components/SuccessMessage";
import { ErrorMessage } from "./components/ErrorMessage";
import { LoadingMessage } from "./components/LoadingMessage";
import { Header } from "./components/Header";
import { useImageUpload } from "./hooks/useImageUpload";

export const App = () => {
  const { isSuccess, isError, isLoading, uploadImage } = useImageUpload();

  return (
    <div className="App">
      <Header />
      <main>
        <ImageUploadForm onSubmit={uploadImage} />
        {isLoading && <LoadingMessage />}
        {isSuccess && <SuccessMessage />}
        {isError && <ErrorMessage />}
      </main>
    </div>
  );
};
