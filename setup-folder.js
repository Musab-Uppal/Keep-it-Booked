import fs from "fs";
import path from "fs";

const folders = [
  "src/components/auth",
  "src/components/books",
  "src/components/layout",
  "src/components/common",
  "src/pages",
  "src/hooks",
  "src/lib",
  "src/utils",
  "src/styles",
  "src/assets",
  "public",
];

folders.forEach((folder) => {
  fs.mkdirSync(folder, { recursive: true });
  console.log(`Created folder: ${folder}`);
});

// Create empty files
const files = [
  "src/lib/supabase.js",
  "src/hooks/useAuth.js",
  "src/hooks/useBooks.js",
  "src/hooks/useSupabase.js",
  "src/utils/helpers.js",
  "src/utils/validators.js",
  "src/components/auth/Login.jsx",
  "src/components/auth/Signup.jsx",
  "src/components/auth/AuthCallback.jsx",
  "src/components/books/BookCard.jsx",
  "src/components/books/BookForm.jsx",
  "src/components/books/BookList.jsx",
  "src/components/books/BookDetails.jsx",
  "src/components/layout/Navbar.jsx",
  "src/components/layout/Sidebar.jsx",
  "src/components/common/LoadingSpinner.jsx",
  "src/components/common/ErrorAlert.jsx",
  "src/components/common/PrivateRoute.jsx",
  "src/pages/Dashboard.jsx",
  "src/pages/AddBook.jsx",
  "src/pages/EditBook.jsx",
  "src/pages/BookPage.jsx",
  "src/pages/Profile.jsx",
];

files.forEach((file) => {
  fs.writeFileSync(file, "");
  console.log(`Created file: ${file}`);
});

console.log("✅ Project structure created successfully!");
