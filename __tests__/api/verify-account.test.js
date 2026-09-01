import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// ---------------------------------------------------------------------------
// Mocks (must be declared before imports)
// ---------------------------------------------------------------------------

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";
import { GET } from "@/app/api/verify-account/route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeGetRequest(url) {
  return { url };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("GET /api/verify-account", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  // -----------------------------------------------------------------------
  // Missing token
  // -----------------------------------------------------------------------

  it("returns 400 when token is missing from query string", async () => {
    const req = makeGetRequest("http://localhost:3000/api/verify-account");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/token not found/i);
  });

  // -----------------------------------------------------------------------
  // Invalid token
  // -----------------------------------------------------------------------

  it("returns 404 when token does not match any user", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const req = makeGetRequest(
      "http://localhost:3000/api/verify-account?token=invalid-token-abc"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/invalid token/i);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { access_token: "invalid-token-abc" },
    });
  });

  // -----------------------------------------------------------------------
  // Already verified
  // -----------------------------------------------------------------------

  it("redirects to already-verified page when user is already verified", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "u1",
      access_token: "valid-token",
      verified: true,
    });

    const req = makeGetRequest(
      "http://localhost:3000/api/verify-account?token=valid-token"
    );
    const res = await GET(req);

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/account/already-verified"
    );
  });

  // -----------------------------------------------------------------------
  // Successful verification
  // -----------------------------------------------------------------------

  it("verifies user, clears access_token, and redirects to verified page on success", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "u1",
      access_token: "valid-token",
      verified: false,
    });
    prisma.user.update.mockResolvedValue({
      id: "u1",
      verified: true,
      access_token: "",
    });

    const req = makeGetRequest(
      "http://localhost:3000/api/verify-account?token=valid-token"
    );
    const res = await GET(req);

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/account/verified"
    );

    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    const updateCall = prisma.user.update.mock.calls[0][0];
    expect(updateCall.where).toEqual({ access_token: "valid-token" });
    expect(updateCall.data.verified).toBe(true);
    expect(updateCall.data.access_token).toBe("");
    expect(updateCall.data.verified_at).toBeInstanceOf(Date);
    expect(updateCall.data.updated_at).toBeInstanceOf(Date);
  });

  // -----------------------------------------------------------------------
  // Database errors
  // -----------------------------------------------------------------------

  it("returns 500 on database error during findUnique", async () => {
    prisma.user.findUnique.mockRejectedValue(new Error("DB connection lost"));

    const req = makeGetRequest(
      "http://localhost:3000/api/verify-account?token=token123"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/server error/i);
  });

  it("returns 500 on database error during update", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "u1",
      access_token: "valid-token",
      verified: false,
    });
    prisma.user.update.mockRejectedValue(new Error("Update failed"));

    const req = makeGetRequest(
      "http://localhost:3000/api/verify-account?token=valid-token"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/server error/i);
  });
});
