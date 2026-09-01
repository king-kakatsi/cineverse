import { describe, it, expect } from "@jest/globals";

import {
  formatRuntime,
  formatRating,
  getRatingColor,
  getGenreNames,
  getDirectorName,
  getCastNames,
  getTrailerUrl,
  getTrailerEmbedUrl,
  getImageUrl,
  isFullUrl,
  movieRate,
  getUserRating,
  getAverageRating,
  getRatingCount,
} from "@/helpers/movieHelper";

// =========================================================================
// formatRuntime()
// =========================================================================

describe("formatRuntime", () => {
  it("returns N/A when minutes is null", () => {
    expect(formatRuntime(null)).toBe("N/A");
  });

  it("returns N/A when minutes is undefined", () => {
    expect(formatRuntime(undefined)).toBe("N/A");
  });

  it("returns N/A when minutes is 0", () => {
    expect(formatRuntime(0)).toBe("N/A");
  });

  it("formats minutes only when less than 60", () => {
    expect(formatRuntime(45)).toBe("45m");
  });

  it("formats hours and minutes when 60 or more", () => {
    expect(formatRuntime(125)).toBe("2h 5m");
  });

  it("formats exact hours", () => {
    expect(formatRuntime(120)).toBe("2h 0m");
  });
});

// =========================================================================
// formatRating()
// =========================================================================

describe("formatRating", () => {
  it("returns 0.0 when rating is null", () => {
    expect(formatRating(null)).toBe("0.0");
  });

  it("returns 0.0 when rating is undefined", () => {
    expect(formatRating(undefined)).toBe("0.0");
  });

  it("formats rating to one decimal place", () => {
    expect(formatRating(7.567)).toBe("7.6");
  });

  it("formats integer rating", () => {
    expect(formatRating(8)).toBe("8.0");
  });
});

// =========================================================================
// getRatingColor()
// =========================================================================

describe("getRatingColor", () => {
  it("returns green for ratings >= 7.5", () => {
    expect(getRatingColor(7.5)).toBe("text-green-500");
    expect(getRatingColor(9.0)).toBe("text-green-500");
  });

  it("returns yellow for ratings >= 6.0 and < 7.5", () => {
    expect(getRatingColor(6.0)).toBe("text-yellow-500");
    expect(getRatingColor(7.4)).toBe("text-yellow-500");
  });

  it("returns orange for ratings >= 4.0 and < 6.0", () => {
    expect(getRatingColor(4.0)).toBe("text-orange-500");
    expect(getRatingColor(5.9)).toBe("text-orange-500");
  });

  it("returns red for ratings < 4.0", () => {
    expect(getRatingColor(3.9)).toBe("text-red-500");
    expect(getRatingColor(0)).toBe("text-red-500");
  });
});

// =========================================================================
// getGenreNames()
// =========================================================================

describe("getGenreNames", () => {
  it("returns N/A when genres is null", () => {
    expect(getGenreNames(null)).toBe("N/A");
  });

  it("returns N/A when genres is empty array", () => {
    expect(getGenreNames([])).toBe("N/A");
  });

  it("returns comma-separated genre names", () => {
    expect(
      getGenreNames([{ name: "Action" }, { name: "Drama" }])
    ).toBe("Action, Drama");
  });
});

// =========================================================================
// getDirectorName()
// =========================================================================

describe("getDirectorName", () => {
  it("returns director name when available", () => {
    expect(getDirectorName({ name: "Nolan" })).toBe("Nolan");
  });

  it("returns Unknown when director is null", () => {
    expect(getDirectorName(null)).toBe("Unknown");
  });

  it("returns Unknown when director is undefined", () => {
    expect(getDirectorName(undefined)).toBe("Unknown");
  });
});

// =========================================================================
// getCastNames()
// =========================================================================

describe("getCastNames", () => {
  it("returns N/A when cast is null", () => {
    expect(getCastNames(null)).toBe("N/A");
  });

  it("returns N/A when cast is empty array", () => {
    expect(getCastNames([])).toBe("N/A");
  });

  it("returns comma-separated cast member names", () => {
    const cast = [
      { person: { name: "Actor A" } },
      { person: { name: "Actor B" } },
    ];
    expect(getCastNames(cast)).toBe("Actor A, Actor B");
  });

  it("filters out cast members without person name", () => {
    const cast = [
      { person: { name: "Actor A" } },
      { person: null },
      { person: { name: "Actor C" } },
    ];
    expect(getCastNames(cast)).toBe("Actor A, Actor C");
  });
});

// =========================================================================
// getTrailerUrl()
// =========================================================================

describe("getTrailerUrl", () => {
  it("returns null when videoKey is null", () => {
    expect(getTrailerUrl(null)).toBeNull();
  });

  it("returns null when videoKey is undefined", () => {
    expect(getTrailerUrl(undefined)).toBeNull();
  });

  it("returns YouTube URL with video key", () => {
    expect(getTrailerUrl("abc123")).toBe(
      "https://www.youtube.com/watch?v=abc123"
    );
  });
});

// =========================================================================
// getTrailerEmbedUrl()
// =========================================================================

describe("getTrailerEmbedUrl", () => {
  it("returns null when videoKey is null", () => {
    expect(getTrailerEmbedUrl(null)).toBeNull();
  });

  it("returns null when videoKey is undefined", () => {
    expect(getTrailerEmbedUrl(undefined)).toBeNull();
  });

  it("returns YouTube embed URL with video key", () => {
    expect(getTrailerEmbedUrl("abc123")).toBe(
      "https://www.youtube.com/embed/abc123"
    );
  });
});

// =========================================================================
// getImageUrl()
// =========================================================================

describe("getImageUrl", () => {
  const oldEnv = process.env;

  beforeEach(() => {
    process.env = { ...oldEnv, NEXT_PUBLIC_TMDB_IMAGE_BASE_URL: "https://image.tmdb.org" };
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  it("returns null when path is null", () => {
    expect(getImageUrl(null)).toBeNull();
  });

  it("returns null when path is undefined", () => {
    expect(getImageUrl(undefined)).toBeNull();
  });

  it("constructs URL with default size w500", () => {
    expect(getImageUrl("/poster.jpg")).toBe(
      "https://image.tmdb.org/w500/poster.jpg"
    );
  });

  it("constructs URL with custom size", () => {
    expect(getImageUrl("/poster.jpg", "w300")).toBe(
      "https://image.tmdb.org/w300/poster.jpg"
    );
  });

  it("returns full URL when isFullUrl is true", () => {
    expect(getImageUrl("https://cdn.example.com/img.jpg", "w500", true)).toBe(
      "https://cdn.example.com/img.jpg"
    );
  });
});

// =========================================================================
// isFullUrl()
// =========================================================================

describe("isFullUrl", () => {
  it("returns true for HTTP URLs", () => {
    expect(isFullUrl("http://example.com")).toBe(true);
  });

  it("returns true for HTTPS URLs", () => {
    expect(isFullUrl("https://example.com")).toBe(true);
  });

  it("returns falsy for non-URL strings", () => {
    expect(isFullUrl("/path/to/file")).toBeFalsy();
  });

  it("returns falsy for null", () => {
    expect(isFullUrl(null)).toBeFalsy();
  });

  it("returns falsy for undefined", () => {
    expect(isFullUrl(undefined)).toBeFalsy();
  });
});

// =========================================================================
// movieRate()
// =========================================================================

describe("movieRate", () => {
  it("returns null when movie is null", () => {
    expect(movieRate(null)).toBeNull();
  });

  it("returns null when movie is undefined", () => {
    expect(movieRate(undefined)).toBeNull();
  });

  it("returns tmdbRating/2 when no user ratings exist (Rating model data absent, no rates)", () => {
    const movie = { vote_average: 8.0, userRatingsAvg: null, userRatingsCount: null, rates: null };
    expect(movieRate(movie)).toBe(4.0);
  });

  it("returns tmdbRating/2 when no user ratings exist (rates empty object)", () => {
    const movie = { vote_average: 6.0, rates: {} };
    expect(movieRate(movie)).toBe(3.0);
  });

  it("returns tmdbRating/2 when userRatingsCount is 0", () => {
    const movie = { vote_average: 8.0, userRatingsAvg: 4.0, userRatingsCount: 0 };
    expect(movieRate(movie)).toBe(4.0);
  });

  it("returns blended average when Rating model data exists", () => {
    // Formula: (userAverage + (tmdbRating / 2)) / 2
    // userAverage = 4.0, tmdbRating = 8.0 -> (4.0 + 4.0) / 2 = 4.0
    const movie = {
      vote_average: 8.0,
      userRatingsAvg: 4.0,
      userRatingsCount: 10,
    };
    expect(movieRate(movie)).toBe(4.0);
  });

  it("returns blended average with different values", () => {
    // userAverage = 3.0, tmdbRating = 10.0 -> (3.0 + 5.0) / 2 = 4.0
    const movie = {
      vote_average: 10.0,
      userRatingsAvg: 3.0,
      userRatingsCount: 5,
    };
    expect(movieRate(movie)).toBe(4.0);
  });

  it("returns blended average when JSON ratings exist (fallback)", () => {
    // rates: { u1: 4, u2: 6 } -> userAverage = 5.0
    // (5.0 + (8.0 / 2)) / 2 = (5.0 + 4.0) / 2 = 4.5
    const movie = { vote_average: 8.0, rates: { u1: 4, u2: 6 } };
    expect(movieRate(movie)).toBe(4.5);
  });

  it("handles empty rates object (falls through to tmdb/2)", () => {
    const movie = { vote_average: 10.0, rates: {} };
    expect(movieRate(movie)).toBe(5.0);
  });

  it("handles single rating in JSON rates", () => {
    // userAverage = 3.0, tmdbRating = 6.0 -> (3.0 + 3.0) / 2 = 3.0
    const movie = { vote_average: 6.0, rates: { u1: 3 } };
    expect(movieRate(movie)).toBe(3.0);
  });

  it("handles multiple ratings in JSON rates", () => {
    // rates: { u1: 2, u2: 4, u3: 5 } -> total = 11, avg = 11/3 = 3.6667
    // (3.6667 + (10/2)) / 2 = (3.6667 + 5) / 2 = 4.3333...
    const movie = { vote_average: 10.0, rates: { u1: 2, u2: 4, u3: 5 } };
    const result = movieRate(movie);
    expect(result).toBeCloseTo(4.3333, 3);
  });

  it("prefers Rating model data over JSON rates when both exist", () => {
    const movie = {
      vote_average: 8.0,
      userRatingsAvg: 5.0,
      userRatingsCount: 3,
      rates: { u1: 1, u2: 2 }, // should be ignored
    };
    // (5.0 + (8.0/2)) / 2 = (5.0 + 4.0) / 2 = 4.5
    expect(movieRate(movie)).toBe(4.5);
  });

  it("returns tmdbRating/2 when vote_average is missing", () => {
    const movie = { rates: null };
    expect(movieRate(movie)).toBe(0);
  });

  it("handles error gracefully (returns null)", () => {
    // Create a movie object where accessing .rates throws an error,
    // forcing execution into the catch block at line 99.
    const movie = { vote_average: 8.0 };
    Object.defineProperty(movie, "rates", {
      get() {
        throw new Error("getter error");
      },
    });
    expect(movieRate(movie)).toBeNull();
  });
});

// =========================================================================
// getUserRating()
// =========================================================================

describe("getUserRating", () => {
  it("returns 0 when userId is null", () => {
    expect(getUserRating({ rates: { u1: 4 } }, null)).toBe(0);
  });

  it("returns 0 when userId is undefined", () => {
    expect(getUserRating({ rates: { u1: 4 } }, undefined)).toBe(0);
  });

  it("returns rating from Rating model (userRatings array) when available", () => {
    const movie = {
      userRatings: [
        { user_id: "u1", rating: 4 },
        { user_id: "u2", rating: 3 },
      ],
    };
    expect(getUserRating(movie, "u1")).toBe(4);
    expect(getUserRating(movie, "u2")).toBe(3);
  });

  it("returns 0 when user is not in Rating model userRatings array", () => {
    const movie = {
      userRatings: [{ user_id: "u1", rating: 4 }],
    };
    expect(getUserRating(movie, "u99")).toBe(0);
  });

  it("falls back to JSON rates field when no userRatings array", () => {
    const movie = {
      rates: { u1: 5, u2: 2 },
    };
    expect(getUserRating(movie, "u1")).toBe(5);
    expect(getUserRating(movie, "u2")).toBe(2);
  });

  it("returns 0 when userId is not in JSON rates", () => {
    const movie = {
      rates: { u1: 5, u2: 2 },
    };
    expect(getUserRating(movie, "u99")).toBe(0);
  });

  it("returns 0 when movie has no rates and no userRatings", () => {
    expect(getUserRating({}, "u1")).toBe(0);
  });

  it("returns 0 when movie is null", () => {
    expect(getUserRating(null, "u1")).toBe(0);
  });

  it("returns 0 when movie is undefined", () => {
    expect(getUserRating(undefined, "u1")).toBe(0);
  });

  it("returns 0 when userRatings exists but user is not found and no rates", () => {
    const movie = {
      userRatings: [{ user_id: "u1", rating: 4 }],
      rates: null,
    };
    expect(getUserRating(movie, "u99")).toBe(0);
  });
});

// =========================================================================
// getAverageRating()
// =========================================================================

describe("getAverageRating", () => {
  it("returns 0 when movie has no ratings at all", () => {
    expect(getAverageRating({})).toBe(0);
  });

  it("returns average from Rating model (userRatingsAvg) when available", () => {
    expect(getAverageRating({ userRatingsAvg: 4.0 })).toBe(4.0);
  });

  it("rounds Rating model average to 1 decimal place", () => {
    expect(getAverageRating({ userRatingsAvg: 3.35 })).toBe(3.4);
    expect(getAverageRating({ userRatingsAvg: 3.34 })).toBe(3.3);
  });

  it("falls back to JSON field average when no userRatingsAvg", () => {
    const movie = { rates: { u1: 4, u2: 6 } };
    // average = (4 + 6) / 2 = 5.0
    expect(getAverageRating(movie)).toBe(5.0);
  });

  it("rounds JSON average to 1 decimal place", () => {
    const movie = { rates: { u1: 3, u2: 4 } };
    // average = (3 + 4) / 2 = 3.5
    expect(getAverageRating(movie)).toBe(3.5);
  });

  it("returns 0 for empty rates object", () => {
    expect(getAverageRating({ rates: {} })).toBe(0);
  });

  it("returns 0 when rates is null", () => {
    expect(getAverageRating({ rates: null })).toBe(0);
  });

  it("handles single rating in rates", () => {
    expect(getAverageRating({ rates: { u1: 4 } })).toBe(4.0);
  });
});

// =========================================================================
// getRatingCount()
// =========================================================================

describe("getRatingCount", () => {
  it("returns 0 when movie has no ratings", () => {
    expect(getRatingCount({})).toBe(0);
  });

  it("returns count from Rating model (userRatingsCount) when available", () => {
    expect(getRatingCount({ userRatingsCount: 42 })).toBe(42);
  });

  it("returns 0 from Rating model when count is 0", () => {
    expect(getRatingCount({ userRatingsCount: 0 })).toBe(0);
  });

  it("falls back to JSON field count when no userRatingsCount", () => {
    const movie = { rates: { u1: 4, u2: 3, u3: 5 } };
    expect(getRatingCount(movie)).toBe(3);
  });

  it("returns 0 for empty rates object", () => {
    expect(getRatingCount({ rates: {} })).toBe(0);
  });

  it("returns 0 when rates is null", () => {
    expect(getRatingCount({ rates: null })).toBe(0);
  });

  it("handles single rating in rates", () => {
    expect(getRatingCount({ rates: { u1: 5 } })).toBe(1);
  });
});
