import { useState } from "react";
import { Typography, TextField, InputAdornment, Box, Fab } from "@mui/material";
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
  const [currentlyReadingIndex, setCurrentlyReadingIndex] = useState(0);
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner message="Loading your library..." />;

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <ErrorAlert message={error.message} onRetry={() => refetch()} />
      </Box>
    );
  }

  const avgRating =
    books && books.length > 0
      ? (books.reduce((sum, b) => sum + b.rating, 0) / books.length).toFixed(1)
      : "—";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(160deg, #0a0a14 0%, #0f0f22 50%, #0d1220 100%)",
        pb: 8,
      }}
    >
      {/* Hero header */}
      <Box
        sx={{
          width: "100%",
          pt: { xs: 2, md: 2.5 },
          pb: { xs: 2, md: 2 },
          px: { xs: 2, md: 3, lg: 4 },
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background:
            "linear-gradient(180deg, rgba(255,200,80,0.04) 0%, transparent 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "0.65rem", md: "0.7rem" },
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: "#FFC850",
                textTransform: "uppercase",
                mb: 0.5,
                opacity: 0.8,
              }}
            >
              Your Collection
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.5rem", md: "1.8rem" },
                letterSpacing: "-0.03em",
                color: "#fff",
                lineHeight: 1.1,
                fontFamily: "'Georgia', serif",
              }}
            >
              My Shelf
            </Typography>
          </Box>

          {/* Stats strip */}
          <Box sx={{ display: "flex", gap: 1.2, flexWrap: "wrap" }}>
            {[
              { label: "Books", value: books?.length || 0 },
              { label: "Avg Rating", value: avgRating },
            ].map(({ label, value }) => (
              <Box
                key={label}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  minWidth: 70,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#FFC850",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    color: "rgba(255,255,255,0.4)",
                    mt: 0.2,
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Currently Reading Section */}
      <Box sx={{ px: { xs: 2, md: 3, lg: 4 }, mt: 2, mb: 1.5 }}>
        {books && books.length > 0 && (
          <Box
            onClick={() =>
              setCurrentlyReadingIndex((prev) => (prev + 1) % books.length)
            }
            sx={{
              p: 1.5,
              borderRadius: "12px",
              background: "rgba(255,200,80,0.08)",
              border: "1px solid rgba(255,200,80,0.2)",
              maxWidth: 200,
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 0 12px rgba(255,200,80,0.15)",
              "&:hover": {
                background: "rgba(255,200,80,0.12)",
                border: "1px solid rgba(255,200,80,0.35)",
                boxShadow: "0 0 16px rgba(255,200,80,0.25)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "#FFC850",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 0.8,
              }}
            >
              Currently Reading
            </Typography>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.2,
                mb: 0.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {books[currentlyReadingIndex].title}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "rgba(255,200,80,0.8)",
              }}
            >
              ★ {books[currentlyReadingIndex].rating}/5
            </Typography>
          </Box>
        )}
      </Box>

      {/* Search bar */}
      <Box sx={{ px: { xs: 2, md: 3, lg: 4 }, mt: 1.5, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by book name or ISBN…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            maxWidth: 300,
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.75rem",
              height: 34,
              transition: "all 0.25s",
              "& fieldset": { border: "none" },
              "&:hover": {
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,200,80,0.2)",
              },
              "&.Mui-focused": {
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,200,80,0.4)",
                boxShadow: "0 0 0 3px rgba(255,200,80,0.08)",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255,255,255,0.3)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Book grid */}
      <Box sx={{ px: { xs: 2, md: 3, lg: 4 } }}>
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
            <Typography sx={{ fontSize: "2.5rem", mb: 1.5 }}>📚</Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.95rem",
                fontWeight: 500,
                mb: 1,
              }}
            >
              Your library is empty
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}
            >
              Start adding books to build your collection
            </Typography>
          </Box>
        )}
      </Box>

      <Fab
        onClick={() => navigate("/add")}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          background: "linear-gradient(135deg, #FFC850, #FF8C42)",
          color: "#0a0a14",
          width: 52,
          height: 52,
          fontWeight: 900,
          boxShadow: "0 8px 30px rgba(255,200,80,0.35)",
          transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          "&:hover": {
            transform: "scale(1.12)",
            boxShadow: "0 12px 40px rgba(255,200,80,0.5)",
            background: "linear-gradient(135deg, #FFD060, #FF9C52)",
          },
        }}
      >
        <AddIcon sx={{ fontSize: 22 }} />
      </Fab>
    </Box>
  );
};

export default Dashboard;
