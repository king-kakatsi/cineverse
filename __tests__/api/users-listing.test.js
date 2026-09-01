import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// ---------------------------------------------------------------------------
// Mocks (must be declared before imports)
// ---------------------------------------------------------------------------

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth", () => ({
  requireAdminUser: jest.fn(),
}));

import prisma from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";
import { GET } from "@/app/api/users/route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeGetRequest() {
  return {};
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("GET /api/users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  // Authentication / authorization
  // -----------------------------------------------------------------------

  it("returns 401 when no auth token is provided (requireAdminUser throws Unauthorized)", async () => {
    requireAdminUser.mockRejectedValue(new Error("Unauthorized"));

    const req = makeGetRequest();
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Unauthorized");
  });

  it("returns 403 when user is not admin (requireAdminUser throws Forbidden)", async () => {
    requireAdminUser.mockRejectedValue(new Error("Forbidden"));

    const req = makeGetRequest();
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Forbidden");
  });

  // -----------------------------------------------------------------------
  // Successful retrieval
  // -----------------------------------------------------------------------

  it("returns 200 with all users when admin is authenticated", async () => {
    const fakeUsers = [
      {
        id: "u1",
        username: "alice",
        email: "alice@example.com",
        role: "ADMIN",
        is_actif: true,
        verified: true,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "u2",
        username: "bob",
        email: "bob@example.com",
        role: "USER",
        is_actif: true,
        verified: true,
        created_at: "2026-01-02T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
      },
    ];

    requireAdminUser.mockResolvedValue({ id: "u1", role: "ADMIN" });
    prisma.user.findMany.mockResolvedValue(fakeUsers);

    const req = makeGetRequest();
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(fakeUsers);
    expect(body.data).toHaveLength(2);
    expect(requireAdminUser).toHaveBeenCalledWith(req);
  });

  it("returns users sorted by created_at descending", async () => {
    const fakeUsers = [
      {
        id: "u2",
        username: "bob",
        email: "bob@example.com",
        role: "USER",
        is_actif: true,
        verified: true,
        created_at: "2026-01-02T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
      },
      {
        id: "u1",
        username: "alice",
        email: "alice@example.com",
        role: "ADMIN",
        is_actif: true,
        verified: true,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    ];

    requireAdminUser.mockResolvedValue({ id: "u1", role: "ADMIN" });
    prisma.user.findMany.mockResolvedValue(fakeUsers);

    const req = makeGetRequest();
    const res = await GET(req);

    expect(res.status).toBe(200);

    // Verify the Prisma query uses orderBy created_at desc
    const queryArgs = prisma.user.findMany.mock.calls[0][0];
    expect(queryArgs.orderBy).toEqual({ created_at: "desc" });

    // Verify the select fields exclude password
    expect(queryArgs.select).not.toHaveProperty("password");
    expect(queryArgs.select).toHaveProperty("id");
    expect(queryArgs.select).toHaveProperty("username");
    expect(queryArgs.select).toHaveProperty("email");
    expect(queryArgs.select).toHaveProperty("role");
    expect(queryArgs.select).toHaveProperty("is_actif");
    expect(queryArgs.select).toHaveProperty("verified");
    expect(queryArgs.select).toHaveProperty("created_at");
    expect(queryArgs.select).toHaveProperty("updated_at");
  });

  it("returns empty array when no users exist", async () => {
    requireAdminUser.mockResolvedValue({ id: "u1", role: "ADMIN" });
    prisma.user.findMany.mockResolvedValue([]);

    const req = makeGetRequest();
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // Database errors
  // -----------------------------------------------------------------------

  it("returns 500 on database error", async () => {
    requireAdminUser.mockResolvedValue({ id: "u1", role: "ADMIN" });
    prisma.user.findMany.mockRejectedValue(new Error("DB connection lost"));

    const req = makeGetRequest();
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("DB connection lost");
  });

  it("returns 500 with default message when error has no message", async () => {
    requireAdminUser.mockResolvedValue({ id: "u1", role: "ADMIN" });
    prisma.user.findMany.mockRejectedValue({});

    const req = makeGetRequest();
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Failed to fetch users");
  });
});
