export const IMG_URL =
  import.meta.env.VITE_OPEN_LIBRARY_URL ||
  "https://covers.openlibrary.org/b/isbn";

export const RATINGS = [1, 2, 3, 4, 5] as const;

export const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export const DATE_FORMAT = "MMMM dd, yyyy";

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You must be logged in to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  DEFAULT: "An error occurred. Please try again.",
} as const;
