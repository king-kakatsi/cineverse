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
import { POST, GET } from "@/app/api/movies/rate/route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePostRequest(body) {
  return { json: async () => body };
}

function makeGetRequest(url) {
  return { url };
}

// ---------------------------------------------------------------------------
// POST /api/movies/rate (deprecated)
// ---------------------------------------------------------------------------

describe("POST /api/movies/rate (deprecated)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when movie_id is missing", async () => {
    const req = makePostRequest({ user_id: "u1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/missing required fields/i);
  });

  it("returns 400 when user_id is missing", async () => {
    const req = makePostRequest({ movie_id: "m1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("returns 400 when rating is missing", async () => {
    const req = makePostRequest({ movie_id: "m1", user_id: "u1" });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
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

  it("returns 404 when movie is not found", async () => {
    prisma.movie.findUnique.mockResolvedValue(null);

    const req = makePostRequest({ movie_id: "nonexistent", user_id: "u1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Movie not found");
  });

  it("creates rating in JSON field successfully", async () => {
    prisma.movie.findUnique.mockResolvedValue({
      id: "m1",
      rates: { existing_user: 3 },
    });
    prisma.movie.update.mockResolvedValue({});
    prisma.rating.upsert.mockResolvedValue({});

    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.movie_id).toBe("m1");
    expect(body.data.user_id).toBe("u1");
    expect(body.data.rating).toBe(4);
    expect(body.data.rates).toEqual({ existing_user: 3, u1: 4 });

    expect(prisma.movie.update).toHaveBeenCalledWith({
      where: { id: "m1" },
      data: { rates: { existing_user: 3, u1: 4 } },
    });
  });

  it("also syncs to Rating model (forward compatibility)", async () => {
    prisma.movie.findUnique.mockResolvedValue({
      id: "m1",
      rates: {},
    });
    prisma.movie.update.mockResolvedValue({});
    prisma.rating.upsert.mockResolvedValue({});

    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 5 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(prisma.rating.upsert).toHaveBeenCalledTimes(1);

    const callArgs = prisma.rating.upsert.mock.calls[0][0];
    expect(callArgs.where.user_id_movie_id).toBe("u1_m1");
    expect(callArgs.create.user_id).toBe("u1");
    expect(callArgs.create.movie_id).toBe("m1");
    expect(callArgs.create.rating).toBe(5);
  });

  it("still returns 200 when Rating model sync fails (inner try-catch)", async () => {
    prisma.movie.findUnique.mockResolvedValue({
      id: "m1",
      rates: {},
    });
    prisma.movie.update.mockResolvedValue({});
    // Simulate failure in the Rating model upsert (inner try-catch)
    prisma.rating.upsert.mockRejectedValue(new Error("Rating model sync failed"));

    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    // The outer response should still succeed because the inner try-catch
    // swallows the rating sync error.
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(prisma.movie.update).toHaveBeenCalledTimes(1);
  });

  it("handles null rates field by defaulting to empty object", async () => {
    prisma.movie.findUnique.mockResolvedValue({
      id: "m1",
      rates: null,
    });
    prisma.movie.update.mockResolvedValue({});
    prisma.rating.upsert.mockResolvedValue({});

    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 3 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.rates).toEqual({ u1: 3 });
  });

  it("returns 500 on database error", async () => {
    prisma.movie.findUnique.mockRejectedValue(new Error("DB connection lost"));

    const req = makePostRequest({ movie_id: "m1", user_id: "u1", rating: 4 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Failed to submit rating");
  });
});

// ---------------------------------------------------------------------------
// GET /api/movies/rate (deprecated)
// ---------------------------------------------------------------------------

describe("GET /api/movies/rate (deprecated)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when movie_id is missing", async () => {
    const req = makeGetRequest("http://localhost/api/movies/rate");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("movie_id required");
  });

  it("returns 404 when movie is not found", async () => {
    prisma.movie.findUnique.mockResolvedValue(null);

    const req = makeGetRequest(
      "http://localhost/api/movies/rate?movie_id=nonexistent"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Movie not found");
  });

  it("returns rating for specific user", async () => {
    prisma.movie.findUnique.mockResolvedValue({
      id: "m1",
      rates: { u1: 4, u2: 3 },
    });

    const req = makeGetRequest(
      "http://localhost/api/movies/rate?movie_id=m1&user_id=u1"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.user_id).toBe("u1");
    expect(body.data.rating).toBe(4);
  });

  it("returns all ratings when no user_id", async () => {
    prisma.movie.findUnique.mockResolvedValue({
      id: "m1",
      rates: { u1: 4, u2: 3 },
    });

    const req = makeGetRequest(
      "http://localhost/api/movies/rate?movie_id=m1"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.rates).toEqual({ u1: 4, u2: 3 });
  });

  it("returns null rating when user has not rated", async () => {
    prisma.movie.findUnique.mockResolvedValue({
      id: "m1",
      rates: { u2: 3 },
    });

    const req = makeGetRequest(
      "http://localhost/api/movies/rate?movie_id=m1&user_id=u1"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.user_id).toBe("u1");
    expect(body.data.rating).toBeNull();
  });

  it("returns empty rates when movie has no rates", async () => {
    prisma.movie.findUnique.mockResolvedValue({
      id: "m1",
      rates: null,
    });

    const req = makeGetRequest(
      "http://localhost/api/movies/rate?movie_id=m1"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.rates).toEqual({});
  });

  it("returns 500 on database error", async () => {
    prisma.movie.findUnique.mockRejectedValue(new Error("DB timeout"));

    const req = makeGetRequest(
      "http://localhost/api/movies/rate?movie_id=m1"
    );
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Failed to fetch rating");
  });
});
