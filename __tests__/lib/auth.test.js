import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// ---------------------------------------------------------------------------
// Mocks (must be declared before imports)
// ---------------------------------------------------------------------------

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import {
  getUserFromToken,
  requireAuthUser,
  requireAdminUser,
} from "@/lib/auth";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(authHeader) {
  return {
    headers: {
      get(name) {
        if (name === "Authorization" && authHeader !== undefined) {
          return authHeader;
        }
        return null;
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Tests: getUserFromToken
// ---------------------------------------------------------------------------

describe("getUserFromToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("returns user when a valid Bearer token is provided and user exists in DB", async () => {
    const fakeUser = { id: "u1", email: "a@b.com", role: "USER" };
    jwt.verify.mockReturnValue({ userId: "u1", email: "a@b.com", role: "USER" });
    prisma.user.findUnique.mockResolvedValue(fakeUser);

    const req = makeRequest("Bearer valid-token-123");
    const user = await getUserFromToken(req);

    expect(user).toEqual(fakeUser);
    expect(jwt.verify).toHaveBeenCalledWith("valid-token-123", "test-secret");
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "u1" },
    });
  });

  it("returns null when no Authorization header is present", async () => {
    const req = makeRequest(null);
    const user = await getUserFromToken(req);

    expect(user).toBeNull();
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("returns null when Authorization header does not start with 'Bearer '", async () => {
    const req = makeRequest("Basic abc123");
    const user = await getUserFromToken(req);

    expect(user).toBeNull();
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it("returns null when the Authorization header is an empty string", async () => {
    const req = makeRequest("");
    const user = await getUserFromToken(req);

    expect(user).toBeNull();
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it("returns null when JWT verification fails (invalid token)", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const req = makeRequest("Bearer bad-token");
    const user = await getUserFromToken(req);

    expect(user).toBeNull();
    expect(jwt.verify).toHaveBeenCalledTimes(1);
  });

  it("returns null when JWT is expired", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    const req = makeRequest("Bearer expired-token");
    const user = await getUserFromToken(req);

    expect(user).toBeNull();
  });

  it("returns null when user is not found in the database", async () => {
    jwt.verify.mockReturnValue({ userId: "nonexistent-id" });
    prisma.user.findUnique.mockResolvedValue(null);

    const req = makeRequest("Bearer valid-token");
    const user = await getUserFromToken(req);

    expect(user).toBeNull();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "nonexistent-id" },
    });
  });

  it("returns null when the database query throws", async () => {
    jwt.verify.mockReturnValue({ userId: "u1" });
    prisma.user.findUnique.mockRejectedValue(new Error("DB connection lost"));

    const req = makeRequest("Bearer valid-token");
    const user = await getUserFromToken(req);

    expect(user).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Tests: requireAuthUser
// ---------------------------------------------------------------------------

describe("requireAuthUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("returns user when authenticated with a valid token", async () => {
    const fakeUser = { id: "u1", email: "a@b.com", role: "USER" };
    jwt.verify.mockReturnValue({ userId: "u1", email: "a@b.com", role: "USER" });
    prisma.user.findUnique.mockResolvedValue(fakeUser);

    const req = makeRequest("Bearer valid-token");
    const user = await requireAuthUser(req);

    expect(user).toEqual(fakeUser);
  });

  it("throws 'Unauthorized' when no Authorization header is present", async () => {
    const req = makeRequest(null);

    await expect(requireAuthUser(req)).rejects.toThrow("Unauthorized");
  });

  it("throws 'Unauthorized' when token format is wrong (no Bearer prefix)", async () => {
    const req = makeRequest("Basic abc123");

    await expect(requireAuthUser(req)).rejects.toThrow("Unauthorized");
  });

  it("throws 'Unauthorized' when JWT is invalid or expired", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt malformed");
    });

    const req = makeRequest("Bearer bad-token");

    await expect(requireAuthUser(req)).rejects.toThrow("Unauthorized");
  });

  it("throws 'Unauthorized' when user does not exist in DB", async () => {
    jwt.verify.mockReturnValue({ userId: "u1" });
    prisma.user.findUnique.mockResolvedValue(null);

    const req = makeRequest("Bearer valid-token");

    await expect(requireAuthUser(req)).rejects.toThrow("Unauthorized");
  });
});

// ---------------------------------------------------------------------------
// Tests: requireAdminUser
// ---------------------------------------------------------------------------

describe("requireAdminUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("returns user when authenticated and role is 'ADMIN'", async () => {
    const fakeUser = { id: "u1", email: "admin@b.com", role: "ADMIN" };
    jwt.verify.mockReturnValue({ userId: "u1", email: "admin@b.com", role: "ADMIN" });
    prisma.user.findUnique.mockResolvedValue(fakeUser);

    const req = makeRequest("Bearer admin-token");
    const user = await requireAdminUser(req);

    expect(user).toEqual(fakeUser);
    expect(user.role).toBe("ADMIN");
  });

  it("throws 'Forbidden' when authenticated but role is 'USER'", async () => {
    const fakeUser = { id: "u2", email: "user@b.com", role: "USER" };
    jwt.verify.mockReturnValue({ userId: "u2", email: "user@b.com", role: "USER" });
    prisma.user.findUnique.mockResolvedValue(fakeUser);

    const req = makeRequest("Bearer user-token");

    await expect(requireAdminUser(req)).rejects.toThrow("Forbidden");
  });

  it("throws 'Forbidden' when role is lowercase 'admin' (case-sensitive check)", async () => {
    const fakeUser = { id: "u3", email: "lower@b.com", role: "admin" };
    jwt.verify.mockReturnValue({ userId: "u3", email: "lower@b.com", role: "admin" });
    prisma.user.findUnique.mockResolvedValue(fakeUser);

    const req = makeRequest("Bearer lower-token");

    await expect(requireAdminUser(req)).rejects.toThrow("Forbidden");
  });

  it("throws 'Unauthorized' when no token is provided", async () => {
    const req = makeRequest(null);

    await expect(requireAdminUser(req)).rejects.toThrow("Unauthorized");
  });

  it("throws 'Unauthorized' when JWT is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });

    const req = makeRequest("Bearer invalid-token");

    await expect(requireAdminUser(req)).rejects.toThrow("Unauthorized");
  });

  it("throws 'Unauthorized' when user not found in DB", async () => {
    jwt.verify.mockReturnValue({ userId: "u1" });
    prisma.user.findUnique.mockResolvedValue(null);

    const req = makeRequest("Bearer valid-token");

    await expect(requireAdminUser(req)).rejects.toThrow("Unauthorized");
  });
});
