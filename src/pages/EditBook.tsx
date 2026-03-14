import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
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
        if (!id) {
          throw new Error("No book ID provided");
        }
        setLoading(true);

        // First check if book is in the local cache
        const cachedBook = books?.find((b) => b.id === id);
        if (cachedBook) {
          setBook(cachedBook);
          setLoading(false);
          return;
        }

        // Otherwise fetch it
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
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
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

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        }}
      >
        <LoadingSpinner message="Loading book details..." />
      </Box>
    );

  if (error || !book) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          pt: 4,
          width: "100%",
        }}
      >
        <Container sx={{ px: { xs: 2, md: 4 } }}>
          <ErrorAlert
            message={error || "Book not found"}
            onRetry={() => navigate("/dashboard")}
          />
        </Container>
      </Box>
    );
  }

  const initialFormData: BookFormData = {
    isbn: book.isbn,
    title: book.title,
    rating: book.rating,
    notes: book.notes || "",
    date_read: new Date(book.date_read),
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
        <Box sx={{ mb: 3, animation: "slideInLeft 0.5s ease-out" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/book/${id}`)}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateX(-4px)",
              },
            }}
          >
            Back to Book
          </Button>
        </Box>

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
            ✏️ Edit Book
          </Typography>

          <BookForm
            initialData={initialFormData}
            onSubmit={onSubmit}
            isSubmitting={updateBook.isPending}
            submitButtonText="Update Book"
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default EditBook;
