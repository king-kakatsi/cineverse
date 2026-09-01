import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn((url) => ({
      status: 307,
      redirected: true,
      url: url.toString(),
      headers: new Map([["location", url.toString()]]),
    })),
    next: jest.fn(() => ({
      status: 200,
      headers: new Map(),
    })),
  },
}));

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { middleware } from "@/middleware";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal mock Request for middleware.
 * @param {string} pathname - The request path
 * @param {object} options
 * @param {string} [options.authHeader] - Authorization header value
 * @param {string} [options.cookieToken] - Token value for cookie
 */
function makeRequest(pathname, { authHeader, cookieToken } = {}) {
  const headers = new Map();
  if (authHeader !== undefined) {
    headers.set("authorization", authHeader);
  }

  const cookies = {};
  if (cookieToken !== undefined) {
    cookies.token = { value: cookieToken };
  }

  return {
    nextUrl: { pathname },
    url: `http://localhost:3000${pathname}`,
    headers: {
      get(name) {
        return headers.get(name.toLowerCase()) || null;
      },
    },
    cookies: {
      get(name) {
        return cookies[name] || null;
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  // -----------------------------------------------------------------------
  // Public routes: no token needed
  // -----------------------------------------------------------------------

  it("allows access to public routes (e.g., /) without a token", async () => {
    const req = makeRequest("/");
    const res = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("allows access to /login without a token", async () => {
    const req = makeRequest("/login");
    const res = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("allows access to /register without a token", async () => {
    const req = makeRequest("/register");
    const res = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("allows access to /movies without a token", async () => {
    const req = makeRequest("/movies");
    const res = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  // -----------------------------------------------------------------------
  // Protected routes: token required
  // -----------------------------------------------------------------------

  it("redirects to /login when accessing /profile without a token", async () => {
    const req = makeRequest("/profile");
    const res = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toContain("/login");
    expect(redirectUrl.toString()).toContain("callbackUrl=%2Fprofile");
  });

  it("redirects to /login when accessing /favorites without a token", async () => {
    const req = makeRequest("/favorites");
    const res = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toContain("/login");
    expect(redirectUrl.toString()).toContain("callbackUrl=%2Ffavorites");
  });

  it("redirects to /login when accessing /user/settings without a token", async () => {
    const req = makeRequest("/user/settings");
    const res = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toContain("/login");
  });

  it("allows access to /profile with a valid token", async () => {
    jwt.verify.mockReturnValue({ userId: "u1", role: "USER" });

    const req = makeRequest("/profile", { authHeader: "Bearer valid-token" });
    const res = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("allows access to /favorites with a valid token (from cookie)", async () => {
    jwt.verify.mockReturnValue({ userId: "u1", role: "USER" });

    const req = makeRequest("/favorites", { cookieToken: "valid-token" });
    const res = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  // -----------------------------------------------------------------------
  // Admin routes
  // -----------------------------------------------------------------------

  it("redirects to /login when accessing /admin without a token", async () => {
    const req = makeRequest("/admin");
    const res = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toContain("/login");
    expect(redirectUrl.toString()).toContain("callbackUrl=%2Fadmin");
  });

  it("redirects to / when a non-admin user accesses /admin", async () => {
    jwt.verify.mockReturnValue({ userId: "u1", role: "USER" });

    const req = makeRequest("/admin", { authHeader: "Bearer user-token" });
    const res = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toBe("http://localhost:3000/");
  });

  it("allows admin to access /admin routes", async () => {
    jwt.verify.mockReturnValue({ userId: "u1", role: "ADMIN" });

    const req = makeRequest("/admin", { authHeader: "Bearer admin-token" });
    const res = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("allows admin to access nested /admin/users routes", async () => {
    jwt.verify.mockReturnValue({ userId: "u1", role: "ADMIN" });

    const req = makeRequest("/admin/users", { authHeader: "Bearer admin-token" });
    const res = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  // -----------------------------------------------------------------------
  // Logged-in users redirected from auth pages
  // -----------------------------------------------------------------------

  it("redirects logged-in user away from /login to /", async () => {
    jwt.verify.mockReturnValue({ userId: "u1", role: "USER" });

    const req = makeRequest("/login", { authHeader: "Bearer valid-token" });
    const res = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toBe("http://localhost:3000/");
  });

  it("redirects logged-in user away from /register to /", async () => {
    jwt.verify.mockReturnValue({ userId: "u1", role: "ADMIN" });

    const req = makeRequest("/register", { authHeader: "Bearer admin-token" });
    const res = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toBe("http://localhost:3000/");
  });

  // -----------------------------------------------------------------------
  // Invalid JWT handling
  // -----------------------------------------------------------------------

  it("treats invalid JWT as unauthenticated and redirects protected routes to /login", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const req = makeRequest("/profile", { authHeader: "Bearer bad-token" });
    const res = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toContain("/login");
  });

  it("allows public routes when JWT is invalid (no redirect needed)", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    const req = makeRequest("/movies", { authHeader: "Bearer expired-token" });
    const res = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  // -----------------------------------------------------------------------
  // Token priority: Authorization header over cookie
  // -----------------------------------------------------------------------

  it("prefers Authorization header token over cookie token", async () => {
    jwt.verify.mockReturnValue({ userId: "u1", role: "USER" });

    const req = makeRequest("/profile", {
      authHeader: "Bearer header-token",
      cookieToken: "cookie-token",
    });
    await middleware(req);

    // jwt.verify should be called with the header token, not the cookie token
    expect(jwt.verify).toHaveBeenCalledWith("header-token", "test-secret");
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------

  it("does not redirect /login when no token is present (user can log in)", async () => {
    const req = makeRequest("/login");
    await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("does not redirect /register when no token is present", async () => {
    const req = makeRequest("/register");
    await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });
});
