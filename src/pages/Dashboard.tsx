import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Fab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import BookList from "../components/books/BookList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";

const Dashboard = () => {
  const { books, isLoading, error, deleteBook, refetch } = useBooks();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner message="Loading your books..." />;

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <ErrorAlert message={error.message} onRetry={() => refetch()} />
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        pb: 4,
        width: "100%",
      }}
    >
      <Container sx={{ pt: 4, px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
            animation: "slideInLeft 0.5s ease-out",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              📚 My Books
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {books?.length || 0} {books?.length === 1 ? "book" : "books"} in
              your collection
            </Typography>
          </Box>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 4,
            animation: "slideInRight 0.5s ease-out",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "12px",
              "&:hover": {
                boxShadow: "0 12px 24px rgba(37, 99, 235, 0.15)",
                transform: "translateY(-2px)",
              },
              "&.Mui-focused": {
                boxShadow: "0 12px 24px rgba(37, 99, 235, 0.25)",
                transform: "translateY(-2px)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "primary.main", mr: 1 }} />
              </InputAdornment>
            ),
          }}
        />

        {books && books.length > 0 ? (
          <BookList
            books={books}
            onDelete={deleteBook.mutate}
            searchTerm={searchTerm}
          />
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No books yet. Start building your collection!
            </Typography>
          </Box>
        )}

        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 15px 35px rgba(37, 99, 235, 0.4)",
            },
          }}
          onClick={() => navigate("/add")}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
};

export default Dashboard;
