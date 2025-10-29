import fs from "fs";
import mongoose from "mongoose";
import supertest from "supertest";
import { afterAll, beforeAll, expect, test } from "vitest";
import { app } from "../app.js";
import { dropAllCollections } from "./utils/dropAllCollections.js";

const request = supertest(app);

const testImageName = "Min blå cykel";
const expectedFilePath = "/img/min-bla-cy.jpeg"; // These seem a bit narrow and error prone. Can I make this better?

beforeAll(async () => {
  process.env.ENV = "test";
  const url = `mongodb://127.0.0.1/image-app-test-db`;
  await mongoose.connect(url);
});

afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});

test("Return 404 for invalid endpoint", async () => {
  const response = await request.get("/invalid");
  expect(response.status).toBe(404);
  expect(response.body.message).toBe(`Cannot find /invalid on this server!`);
});

test("POST /images - upload image", async () => {
  // I should probably add tests for format and filename here
  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/Min blå cykel.jpeg");

  // Check if any file matching the pattern exists and get its path
  // TODO: These are a lot of lines for a test. Can I simplify?
  const files = fs.readdirSync("public/img");
  const pattern = /^min-bla-cy-\d{13,}\.jpeg$/;
  const matchingFile = files.find((file) => pattern.test(file));
  const fileExists = !!matchingFile;
  const actualFilePath = matchingFile ? `/img/${matchingFile}` : ""; // TODO: Is this really correct?

  if (fileExists) {
    fs.unlink(`public${actualFilePath}`, (err) => {
      if (err) throw err;
    });
  }

  // Get the file path from response
  const uploadedFilePath = response.body.data.data.path;

  // Use sharp to get image dimensions
  const sharp = await import("sharp"); // TODO: Can I move this import to the top?
  const metadata = await sharp.default(`${uploadedFilePath}`).metadata();

  expect(response.status).toBe(201);
  expect(response.body.data.data.name).toBe(testImageName);
  expect(response.body.data.data.path).toMatch(
    /\/img\/min-bla-cy-\d{13,}\.jpeg$/
  ); // Check for '/img/' prefix, first 10 chars of name with dashes, and timestamp.jpg TODO: Save as a constant
  expect(fileExists).toBe(true);
  expect(metadata.width).toBe(400);
  expect(metadata.height).toBe(400);
});

test("POST /images - should return 400 for invalid file format", async () => {
  const response = await request
    .post("/images")
    .field("name", "wrong-format")
    .attach("photo", "test/utils/test.txt");

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid file format");
});

test("GET /images - returns array of metadata for uploaded images", async () => {
  const response = await request.get("/images");

  expect(response.status).toBe(200);
  expect(response.body.data.length).toBe(2);
  // expect(response.body.data[0].name).toBe(testImageName);
  // expect(response.body.data[0].path).toBe(expectedFilePath);
});

