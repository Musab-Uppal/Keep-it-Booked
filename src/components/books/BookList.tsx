import { Typography, Box } from "@mui/material";
import { Book } from "../../types";
import BookCard from "./BookCard";

interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
  searchTerm?: string;
}

const BookList = ({ books, onDelete, searchTerm = "" }: BookListProps) => {
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm),
  );

  if (filteredBooks.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography sx={{ fontSize: "2rem", mb: 2 }}>🔍</Typography>
        <Typography
          sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem" }}
        >
          {searchTerm
            ? "No books match your search"
            : "No books yet — add your first one!"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(auto-fill, minmax(130px, 1fr))",
          sm: "repeat(auto-fill, minmax(150px, 1fr))",
          md: "repeat(auto-fill, minmax(160px, 1fr))",
        },
        gap: { xs: 1.2, md: 1.5 },
      }}
    >
      {filteredBooks.map((book, i) => (
        <Box
          key={book.id}
          sx={{
            animation: "fadeSlideUp 0.4s ease-out both",
            animationDelay: `${i * 0.05}s`,
            "@keyframes fadeSlideUp": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <BookCard book={book} onDelete={onDelete} />
        </Box>
      ))}
    </Box>
  );
};

export default BookList;
