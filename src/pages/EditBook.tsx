import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useBooks } from "../hooks/useBooks";
import { supabase } from "../lib/supabase";
import BookForm from "../components/books/BookForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";
import { Book, BookFormData } from "../types";

const EditBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, updateBook } = useBooks();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBook = async () => {
      try {
        if (!id) throw new Error("No book ID provided");
        setLoading(true);
        const cachedBook = books?.find((b) => b.id === id);
        if (cachedBook) {
          setBook(cachedBook);
          setLoading(false);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error: fetchError } = await supabase
          .from("books")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();
        if (fetchError) throw fetchError;
        setBook(data as Book);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id, books]);

  const onSubmit = async (data: BookFormData) => {
    if (!id) return;
    try {
      await updateBook.mutateAsync({ id, ...data });
      navigate(`/book/${id}`);
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  if (loading) return <LoadingSpinner message="Loading book..." />;

  if (error || !book) {
    return (
      <Box sx={{ p: 4 }}>
        <ErrorAlert
          message={error || "Book not found"}
          onRetry={() => navigate("/dashboard")}
        />
      </Box>
    );
  }

  const initialFormData: BookFormData = {
    isbn: book.isbn,
    title: book.title,
    rating: book.rating,
    date_read: new Date(book.date_read),
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(160deg, #0a0a14 0%, #0f0f22 50%, #0d1220 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          pt: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <IconButton
          onClick={() => navigate(`/book/${id}`)}
          sx={{
            color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            width: 32,
            height: 32,
            transition: "all 0.2s",
            "&:hover": {
              color: "#FFC850",
              borderColor: "rgba(255,200,80,0.3)",
              background: "rgba(255,200,80,0.06)",
              transform: "translateX(-2px)",
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Box>
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#FFC850",
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            Book Details
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.02em",
              fontFamily: "'Georgia', serif",
            }}
          >
            Edit Book
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          pt: { xs: 1.5, md: 2 },
          px: { xs: 2, md: 3 },
          pb: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            animation: "fadeSlideUp 0.4s ease-out",
            "@keyframes fadeSlideUp": {
              from: { opacity: 0, transform: "translateY(16px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Box
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: "16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
            }}
          >
            <BookForm
              initialData={initialFormData}
              onSubmit={onSubmit}
              isSubmitting={updateBook.isPending}
              submitButtonText="Save Changes"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditBook;
