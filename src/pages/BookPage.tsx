import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBooks } from "../hooks/useBooks";
import { supabase } from "../lib/supabase";
import BookDetails from "../components/books/BookDetails";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";
import { Book } from "../types";

const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, deleteBook, updateNotes } = useBooks();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      try {
        if (!id) {
          throw new Error("No book ID provided");
        }
        console.log("BookPage: Starting to load book with id:", id);
        setLoading(true);

        // First check if book is in the local cache
        const cachedBook = books?.find((b) => b.id === id);
        if (cachedBook) {
          console.log("BookPage: Found book in cache:", cachedBook);
          setBook(cachedBook);
          setLoading(false);
          return;
        }

        // Otherwise fetch it
        console.log("BookPage: Fetching book from Supabase...");
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

        console.log("BookPage: Got book data:", data);
        setBook(data as Book);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("BookPage: Error loading book:", message);
        setError(message);
      } finally {
        console.log("BookPage: Setting loading to false");
        setLoading(false);
      }
    };

    loadBook();
  }, [id, books]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteBook.mutateAsync(id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleUpdateNotes = async (notes: string) => {
    if (!id) return;

    try {
      const updatedBook = await updateNotes.mutateAsync({ id, notes });
      setBook(updatedBook);
    } catch (error) {
      console.error("Failed to update notes:", error);
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
            mb: 4,
            animation: "slideInLeft 0.5s ease-out",
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateX(-4px)",
              },
            }}
          >
            Back to Dashboard
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<EditIcon />}
              onClick={() => navigate(`/edit/${id}`)}
              sx={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "white",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.3)",
                },
              }}
              variant="contained"
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              color="error"
              variant="contained"
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
          <BookDetails
            book={book}
            onUpdateNotes={handleUpdateNotes}
            isUpdating={updateNotes.isPending}
          />
        </Box>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Book</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{book.title}"? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={deleteBook.isPending}
            >
              {deleteBook.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BookPage;
