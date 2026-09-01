import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("@/services/axiosService", () => ({
  getFromApi: jest.fn(),
  postWithApi: jest.fn(),
}));

import { getFromApi, postWithApi } from "@/services/axiosService";
import ratingService from "@/services/ratingService";

describe("ratingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // getRating
  // -------------------------------------------------------------------------

  describe("getRating", () => {
    it("calls getFromApi with correct endpoint and query params", async () => {
      getFromApi.mockResolvedValue([true, { rating: 4 }]);

      const result = await ratingService.getRating("movie123", "user456");

      expect(getFromApi).toHaveBeenCalledTimes(1);
      expect(getFromApi).toHaveBeenCalledWith(
        "ratings?movie_id=movie123&user_id=user456"
      );
      expect(result).toEqual([true, { rating: 4 }]);
    });

    it("propagates the response from getFromApi", async () => {
      const expectedResponse = [false, { error: "not found" }];
      getFromApi.mockResolvedValue(expectedResponse);

      const result = await ratingService.getRating("m1", "u1");

      expect(result).toBe(expectedResponse);
    });
  });

  // -------------------------------------------------------------------------
  // submitRating
  // -------------------------------------------------------------------------

  describe("submitRating", () => {
    it("calls postWithApi with correct endpoint and body", async () => {
      postWithApi.mockResolvedValue([
        true,
        { success: true, message: "Rating submitted successfully" },
      ]);

      const result = await ratingService.submitRating("movie123", "user456", 4);

      expect(postWithApi).toHaveBeenCalledTimes(1);
      expect(postWithApi).toHaveBeenCalledWith("ratings", {
        movie_id: "movie123",
        user_id: "user456",
        rating: 4,
      });
      expect(result[0]).toBe(true);
    });

    it("propagates the response from postWithApi", async () => {
      const expectedResponse = [false, { error: "validation failed" }];
      postWithApi.mockResolvedValue(expectedResponse);

      const result = await ratingService.submitRating("m1", "u1", 3);

      expect(result).toBe(expectedResponse);
    });
  });

  // -------------------------------------------------------------------------
  // getAllRatings
  // -------------------------------------------------------------------------

  describe("getAllRatings", () => {
    it("calls getFromApi with correct endpoint including movie_id", async () => {
      getFromApi.mockResolvedValue([
        true,
        { ratings: [{ user_id: "u1", rating: 4 }] },
      ]);

      const result = await ratingService.getAllRatings("movie123");

      expect(getFromApi).toHaveBeenCalledTimes(1);
      expect(getFromApi).toHaveBeenCalledWith("ratings?movie_id=movie123");
      expect(result[0]).toBe(true);
    });

    it("propagates the response from getFromApi", async () => {
      const expectedResponse = [true, { ratings: [] }];
      getFromApi.mockResolvedValue(expectedResponse);

      const result = await ratingService.getAllRatings("m1");

      expect(result).toBe(expectedResponse);
    });
  });
});
