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
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {searchTerm
            ? "No books match your search"
            : "No books found. Start by adding a new book!"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 3,
      }}
    >
      {filteredBooks.map((book) => (
        <Box key={book.id}>
          <BookCard book={book} onDelete={onDelete} />
        </Box>
      ))}
    </Box>
  );
};

export default BookList;
