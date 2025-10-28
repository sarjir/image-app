import fs from "fs";
import mongoose from "mongoose";
import supertest from "supertest";
import { afterAll, beforeAll, expect, test } from "vitest";
import { app } from "../app.js";
import { dropAllCollections } from "./utils/dropAllCollections.js";

const request = supertest(app);

const testImageName = "Test";
const expectedFilePath = "/img/Test.jpeg"; // These seem a bit narrow and error prone. Can I make this better?

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

test.only("POST /images - upload image", async () => { // I should probably add tests for format and filename here
  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/test.jpeg");

  const fileExists = fs.existsSync(`public${expectedFilePath}`);

  if (fileExists) {
    fs.unlink(`public${expectedFilePath}`, (err) => {
      if (err) throw err;
    });
  }

  console.log(response.body)

  expect(response.status).toBe(201);
  expect(response.body.data.data.name).toBe(testImageName);
  expect(response.body.data.data.path).toBe(expectedFilePath);
  expect(fileExists).toBe(true);
});

test("POST /images - should return 400 for invalid file format", async () => {
  const response = await request
    .post("/images")
    .field("name", 'wrong-format')
    .attach("photo", "test/utils/test.txt");

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid file format");
});


test("GET /images - returns array of metadata for uploaded images", async () => {
  const response = await request.get("/images");

  expect(response.status).toBe(200);
  expect(response.body.data.length).toBe(1);
  expect(response.body.data[0].name).toBe(testImageName);
  expect(response.body.data[0].path).toBe(expectedFilePath);
});
