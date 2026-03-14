import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Box } from "@mui/material";
import { useBooks } from "../hooks/useBooks";
import BookForm from "../components/books/BookForm";
import { BookFormData } from "../types";

const AddBook = () => {
  const navigate = useNavigate();
  const { addBook } = useBooks();

  const onSubmit = async (data: BookFormData) => {
    try {
      await addBook.mutateAsync(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        pb: 4,
        width: "100%",
      }}
    >
      <Container sx={{ pt: 4, px: { xs: 2, md: 4 }, maxWidth: "600px" }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            animation: "fadeIn 0.5s ease-out",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
            border: "1px solid rgba(229, 231, 235, 0.6)",
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            📚 Add New Book
          </Typography>

          <BookForm
            onSubmit={onSubmit}
            isSubmitting={addBook.isPending}
            submitButtonText="Add Book"
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default AddBook;
