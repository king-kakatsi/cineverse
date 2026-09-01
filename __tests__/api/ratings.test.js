import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock prisma before importing the route
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    rating: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    movie: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";
import { POST, GET } from "@/app/api/ratings/route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal mock Request for POST handlers (body read via .json()). */
function makePostRequest(body) {
  return { json: async () => body };
}

/** Build a minimal mock Request for GET handlers (url-based query params). */
function makeGetRequest(url) {
  return { url };
}

// ---------------------------------------------------------------------------
// POST /api/ratings
// ---------------------------------------------------------------------------

describe("POST /api/ratings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when movie_id is missing", async () => {
    const req = makePostRequest({ user_id: "u1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/Movie ID/i);
  });

  it("returns 400 when user_id is missing", async () => {
    const req = makePostRequest({ movie_id: "m1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/User ID/i);
  });

  it("returns 400 when rating is missing", async () => {
    const req = makePostRequest({ movie_id: "m1", user_id: "u1" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/rating/i);
  });

  it("returns 400 when rating is less than 1", async () => {
    // Use 0.5 (truthy, passes !rating check) to trigger the range validation.
    // Integer 0 is falsy and would be caught by the "required" check first.
    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 0.5 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/between 1 and 5/);
  });

  it("returns 400 when rating is greater than 5", async () => {
    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 6 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/between 1 and 5/);
  });

  it("creates a new rating successfully", async () => {
    prisma.rating.upsert.mockResolvedValue({
      id: "r1",
      user_id: "u1",
      movie_id: "m1",
      rating: 4,
    });

    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.rating).toBe(4);
    expect(prisma.rating.upsert).toHaveBeenCalledTimes(1);
  });

  it("updates an existing rating (upsert) successfully", async () => {
    prisma.rating.upsert.mockResolvedValue({
      id: "r1",
      user_id: "u1",
      movie_id: "m1",
      rating: 3,
    });

    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 3 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.rating).toBe(3);
    expect(prisma.rating.upsert).toHaveBeenCalledTimes(1);

    const callArgs = prisma.rating.upsert.mock.calls[0][0];
    expect(callArgs.where.user_id_movie_id).toBe("u1_m1");
    expect(callArgs.create.rating).toBe(3);
    expect(callArgs.update.rating).toBe(3);
  });

  it("returns 500 on database error", async () => {
    prisma.rating.upsert.mockRejectedValue(new Error("DB connection lost"));

    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Failed to submit rating");
  });
});

// ---------------------------------------------------------------------------
// GET /api/ratings
// ---------------------------------------------------------------------------

describe("GET /api/ratings", () => {
  // Use a string date so it survives NextResponse.json() serialization.
  const dateStr = "2026-01-15T10:30:00.000Z";

  const fakeRating = {
    id: "r1",
    user_id: "u1",
    movie_id: "m1",
    rating: 4,
    created_at: dateStr,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns ratings filtered by movie_id", async () => {
    prisma.rating.findMany.mockResolvedValue([fakeRating]);

    const req = makeGetRequest(
      "http://localhost/api/ratings?movie_id=m1"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.ratings).toEqual([fakeRating]);

    const callArgs = prisma.rating.findMany.mock.calls[0][0];
    expect(callArgs.where).toEqual({ movie_id: "m1" });
  });

  it("returns ratings filtered by user_id", async () => {
    prisma.rating.findMany.mockResolvedValue([fakeRating]);

    const req = makeGetRequest(
      "http://localhost/api/ratings?user_id=u1"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.ratings).toEqual([fakeRating]);

    const callArgs = prisma.rating.findMany.mock.calls[0][0];
    expect(callArgs.where).toEqual({ user_id: "u1" });
  });

  it("returns ratings filtered by both movie_id and user_id", async () => {
    prisma.rating.findMany.mockResolvedValue([fakeRating]);

    const req = makeGetRequest(
      "http://localhost/api/ratings?movie_id=m1&user_id=u1"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.ratings).toEqual([fakeRating]);

    const callArgs = prisma.rating.findMany.mock.calls[0][0];
    expect(callArgs.where).toEqual({ movie_id: "m1", user_id: "u1" });
  });

  it("returns empty array when no ratings match", async () => {
    prisma.rating.findMany.mockResolvedValue([]);

    const req = makeGetRequest(
      "http://localhost/api/ratings?movie_id=nonexistent"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.ratings).toEqual([]);
  });

  it("returns 500 on database error", async () => {
    prisma.rating.findMany.mockRejectedValue(new Error("DB timeout"));

    const req = makeGetRequest(
      "http://localhost/api/ratings?movie_id=m1"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Failed to fetch ratings");
  });
});
