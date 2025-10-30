import { render, screen, cleanup } from "@testing-library/react";
import { expect, test, beforeAll, afterAll, afterEach } from "vitest";
import { App } from "./App";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

const server = setupServer(
  http.post("http://localhost:3002/images", () => {
    return HttpResponse.json({
      _id: "5ebab07f4129f90039095823",
      name: "myimage",
      path: "/img/myimage.jpeg",
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

test("renders upload image form", async () => {
  const user = userEvent.setup();
  render(<App />);

  const title = screen.getByText(/Image Uploading App/i);
  const fileInput = screen.getByLabelText("Upload an image:");
  const nameInput = screen.getByRole("textbox");
  const submitButton = screen.getByRole("button", { name: /Submit/i });

  expect(title).toBeInTheDocument();
  expect(fileInput).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();

  await user.upload(
    fileInput,
    new File(["dummy content"], "myimage.jpeg", { type: "image/jpeg" })
  );
  await user.type(nameInput, "myimage");
  await user.click(submitButton);

  await screen.findByText("Image uploaded successfully! 🎉");
});

test("shows error message when request fails", async () => {
  server.use(
    http.post("http://localhost:3002/images", () => {
      return new HttpResponse(null, { status: 400 });
    })
  );

  const user = userEvent.setup();
  render(<App />);

  const fileInput = screen.getByLabelText("Upload an image:");
  const nameInput = screen.getByRole("textbox");
  const submitButton = screen.getByRole("button", { name: /Submit/i });

  await user.upload(
    fileInput,
    new File(["dummy content"], "myimage.jpeg", { type: "image/jpeg" })
  );
  await user.type(nameInput, "myimage");
  await user.click(submitButton);

  await screen.findByText("Failed to upload image. Please try again.");
});
