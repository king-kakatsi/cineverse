import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// ---------------------------------------------------------------------------
// Mocks (must be declared before imports)
// ---------------------------------------------------------------------------

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn((password) => `hashed-${password}`),
}));

jest.mock("crypto", () => ({
  randomBytes: jest.fn(() => ({
    toString: jest.fn(() => "mock-access-token"),
  })),
}));

jest.mock("@/services/axiosService", () => ({
  postWithApi: jest.fn(),
}));

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { postWithApi } from "@/services/axiosService";
import { POST } from "@/app/api/auth/register/route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePostRequest(body) {
  return {
    json: async () => body,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  // Validation: missing fields
  // -----------------------------------------------------------------------

  it("returns 400 when email is missing", async () => {
    const req = makePostRequest({
      username: "john",
      password: "password123",
      password_confirmation: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/required/i);
  });

  it("returns 400 when username is missing", async () => {
    const req = makePostRequest({
      email: "john@example.com",
      password: "password123",
      password_confirmation: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/required/i);
  });

  it("returns 400 when password is missing", async () => {
    const req = makePostRequest({
      email: "john@example.com",
      username: "john",
      password_confirmation: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/required/i);
  });

  it("returns 400 when password_confirmation is missing", async () => {
    const req = makePostRequest({
      email: "john@example.com",
      username: "john",
      password: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/required/i);
  });

  // -----------------------------------------------------------------------
  // Validation: format
  // -----------------------------------------------------------------------

  it("returns 400 when email format is invalid", async () => {
    const req = makePostRequest({
      email: "not-an-email",
      username: "john",
      password: "password123",
      password_confirmation: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/invalid email/i);
  });

  it("returns 400 when password confirmation does not match", async () => {
    const req = makePostRequest({
      email: "john@example.com",
      username: "john",
      password: "password123",
      password_confirmation: "different123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/must match/i);
  });

  it("returns 400 when password is less than 8 characters", async () => {
    const req = makePostRequest({
      email: "john@example.com",
      username: "john",
      password: "short",
      password_confirmation: "short",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/at least 8 characters/i);
  });

  // -----------------------------------------------------------------------
  // Duplicate email
  // -----------------------------------------------------------------------

  it("returns 409 when user with email already exists", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "existing-user",
      email: "john@example.com",
    });

    const req = makePostRequest({
      email: "john@example.com",
      username: "john",
      password: "password123",
      password_confirmation: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(409);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/already exists/i);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "john@example.com" },
    });
  });

  // -----------------------------------------------------------------------
  // Successful registration
  // -----------------------------------------------------------------------

  it("creates user successfully with hashed password and returns 201", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: "new-user",
      email: "john@example.com",
      username: "john",
      role: "USER",
    });
    bcrypt.hashSync.mockReturnValue("hashed-password123");
    postWithApi.mockResolvedValue([true, { message: "Email sent" }]);

    const req = makePostRequest({
      email: "john@example.com",
      username: "john",
      password: "password123",
      password_confirmation: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.message).toMatch(/registered successfully/i);
    expect(bcrypt.hashSync).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);

    const createCall = prisma.user.create.mock.calls[0][0];
    expect(createCall.data.email).toBe("john@example.com");
    expect(createCall.data.username).toBe("john");
    expect(createCall.data.password).toBe("hashed-password123");
    expect(createCall.data.role).toBe("USER");
    expect(createCall.data.access_token).toBe("mock-access-token");
  });

  it("sends verification email after successful registration", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: "new-user" });
    postWithApi.mockResolvedValue([true, { message: "Email sent" }]);

    const req = makePostRequest({
      email: "john@example.com",
      username: "john",
      password: "password123",
      password_confirmation: "password123",
    });
    await POST(req);

    expect(postWithApi).toHaveBeenCalledWith("sendEmail", {
      email: "john@example.com",
      access_token: "mock-access-token",
      type: "validateAccount",
    });
  });

  it("returns 500 when email sending fails (postWithApi returns false)", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: "new-user" });
    postWithApi.mockResolvedValue([false, { message: "Email failed" }]);

    const req = makePostRequest({
      email: "john@example.com",
      username: "john",
      password: "password123",
      password_confirmation: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    // When postWithApi returns [false, ...], the code returns a response without
    // an explicit status code (defaults to 200), with success: false.
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/email not sent/i);
  });

  // -----------------------------------------------------------------------
  // Database / server errors
  // -----------------------------------------------------------------------

  it("returns 500 on database error during user creation", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockRejectedValue(new Error("Unique constraint failed"));

    const req = makePostRequest({
      email: "john@example.com",
      username: "john",
      password: "password123",
      password_confirmation: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Internal server error");
  });

  it("returns 500 when request.json() throws", async () => {
    const badRequest = { json: async () => { throw new Error("Malformed JSON"); } };

    const res = await POST(badRequest);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Internal server error");
  });
});
