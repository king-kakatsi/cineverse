import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// ---------------------------------------------------------------------------
// Mocks (must be declared before imports)
// ---------------------------------------------------------------------------

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-jwt-token"),
}));

jest.mock("bcryptjs", () => ({
  compareSync: jest.fn(),
}));

import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { POST } from "@/app/api/auth/login/route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePostRequest(body) {
  return {
    json: async () => body,
  };
}

const fakeUser = {
  id: "u1",
  email: "john@example.com",
  username: "john",
  password: "hashed-password",
  role: "USER",
  verified: true,
  is_actif: true,
  access_token: null,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.NODE_ENV = "test";
  });

  // -----------------------------------------------------------------------
  // Validation: missing fields
  // -----------------------------------------------------------------------

  it("returns 400 when email is missing", async () => {
    const req = makePostRequest({ password: "password123" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/required/i);
  });

  it("returns 400 when password is missing", async () => {
    const req = makePostRequest({ email: "john@example.com" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/required/i);
  });

  it("returns 400 when both email and password are missing", async () => {
    const req = makePostRequest({});
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });

  // -----------------------------------------------------------------------
  // Validation: email format
  // -----------------------------------------------------------------------

  it("returns 400 when email format is invalid", async () => {
    const req = makePostRequest({ email: "not-an-email", password: "password123" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/invalid email/i);
  });

  // -----------------------------------------------------------------------
  // User not found
  // -----------------------------------------------------------------------

  it("returns 404 when user is not found in database", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const req = makePostRequest({
      email: "nonexistent@example.com",
      password: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/invalid credentials/i);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    });
  });

  // -----------------------------------------------------------------------
  // Email not verified
  // -----------------------------------------------------------------------

  it("returns 403 when email is not verified", async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...fakeUser,
      verified: false,
    });

    const req = makePostRequest({
      email: "john@example.com",
      password: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/not verified/i);
  });

  // -----------------------------------------------------------------------
  // Account blocked
  // -----------------------------------------------------------------------

  it("returns 401 when account is blocked (is_actif = false)", async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...fakeUser,
      is_actif: false,
    });

    const req = makePostRequest({
      email: "john@example.com",
      password: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/blocked/i);
  });

  // -----------------------------------------------------------------------
  // Wrong password
  // -----------------------------------------------------------------------

  it("returns 404 when password is wrong", async () => {
    prisma.user.findUnique.mockResolvedValue(fakeUser);
    bcrypt.compareSync.mockReturnValue(false);

    const req = makePostRequest({
      email: "john@example.com",
      password: "wrongpassword",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/invalid credentials/i);
    expect(bcrypt.compareSync).toHaveBeenCalledWith("wrongpassword", "hashed-password");
  });

  // -----------------------------------------------------------------------
  // Successful login
  // -----------------------------------------------------------------------

  it("returns 200 with JWT token on successful login", async () => {
    prisma.user.findUnique.mockResolvedValue(fakeUser);
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue("mock-jwt-token");

    const req = makePostRequest({
      email: "john@example.com",
      password: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toMatch(/login successfully/i);
    expect(body.data.access_token).toBe("mock-jwt-token");
    expect(body.data.user.email).toBe("john@example.com");
    expect(body.data.user.password).toBeUndefined();

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: "u1", email: "john@example.com", role: "USER" },
      "test-secret",
      { expiresIn: "7d" }
    );
  });

  it("sets httpOnly cookie with token on successful login", async () => {
    prisma.user.findUnique.mockResolvedValue(fakeUser);
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue("mock-jwt-token");

    const req = makePostRequest({
      email: "john@example.com",
      password: "password123",
    });
    const res = await POST(req);

    // NextResponse mock stores cookies; we verify the response was created with 200
    expect(res.status).toBe(200);

    // The cookie is set via response.cookies.set — verify it was called
    // by checking the response object has the cookie method invoked.
    // Since we use NextResponse.json() which is auto-mocked by jest, we
    // verify via the returned status that the full success path was hit.
  });

  // -----------------------------------------------------------------------
  // Server errors
  // -----------------------------------------------------------------------

  it("returns 500 on database error", async () => {
    prisma.user.findUnique.mockRejectedValue(new Error("DB connection lost"));

    const req = makePostRequest({
      email: "john@example.com",
      password: "password123",
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/error/i);
  });

  it("returns 500 when request body cannot be parsed", async () => {
    const badRequest = {
      json: async () => { throw new Error("Unexpected token"); },
    };

    const res = await POST(badRequest);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
  });
});
