module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": [
      "babel-jest",
      {
        presets: [["@babel/preset-env", { targets: { node: "current" } }]],
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/lib/auth.js",
    "src/middleware.js",
    "src/app/api/auth/register/route.js",
    "src/app/api/auth/login/route.js",
    "src/app/api/users/route.js",
    "src/app/api/verify-account/route.js",
    "src/app/api/ratings/route.js",
    "src/app/api/movies/rate/route.js",
    "src/services/ratingService.js",
    "src/helpers/movieHelper.js",
  ],
  coverageDirectory: "coverage",
  testMatch: ["<rootDir>/__tests__/**/*.test.js"],
};
