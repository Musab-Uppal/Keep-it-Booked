export const isValidIsbn = (isbn: string): boolean => {
  // Remove hyphens and spaces
  const cleanIsbn = isbn.replace(/[-\s]/g, "");

  // Check if it's ISBN-10 or ISBN-13
  const isbn10Regex = /^\d{9}[\dX]$/;
  const isbn13Regex = /^\d{13}$/;

  return isbn10Regex.test(cleanIsbn) || isbn13Regex.test(cleanIsbn);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
