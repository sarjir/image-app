import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { App } from "./App";

test("renders upload image form", () => {
  render(<App />);

  const title = screen.getByText(/Image Uploading App/i);
  const fileInput = screen.getByLabelText("Upload an image:");
  const nameInput = screen.getByRole("textbox");
  const submitButton = screen.getByRole("button", { name: /Submit/i });

  expect(title).toBeInTheDocument();
  expect(fileInput).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});
