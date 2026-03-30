import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBooks } from "../hooks/useBooks";
import { supabase } from "../lib/supabase";
import BookDetails from "../components/books/BookDetails";
import BookNotes from "../components/books/BookNotes";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorAlert from "../components/common/ErrorAlert";
import { Book } from "../types";

const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, deleteBook } = useBooks();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteBook.mutateAsync(id);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner message="Loading book…" />;

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
      {/* Top bar */}
      <Box
        sx={{
          px: { xs: 2, md: 3, lg: 4 },
          pt: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => navigate("/dashboard")}
            sx={{
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              width: 36,
              height: 36,
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
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.3)",
              fontWeight: 500,
            }}
          >
            Library
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            startIcon={<EditIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate(`/edit/${id}`)}
            sx={{
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              px: 2,
              py: 0.75,
              fontSize: "0.82rem",
              fontWeight: 600,
              transition: "all 0.2s",
              "&:hover": {
                color: "#FFC850",
                borderColor: "rgba(255,200,80,0.3)",
                background: "rgba(255,200,80,0.06)",
              },
            }}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              color: "rgba(255,100,100,0.8)",
              border: "1px solid rgba(255,100,100,0.15)",
              borderRadius: "10px",
              px: 2,
              py: 0.75,
              fontSize: "0.82rem",
              fontWeight: 600,
              transition: "all 0.2s",
              "&:hover": {
                color: "#ff6b6b",
                borderColor: "rgba(255,100,100,0.3)",
                background: "rgba(255,100,100,0.06)",
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          px: { xs: 2, md: 3, lg: 4 },
          pt: { xs: 2.5, md: 3 },
          animation: "fadeSlideUp 0.4s ease-out",
          "@keyframes fadeSlideUp": {
            from: { opacity: 0, transform: "translateY(16px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <BookDetails book={book} />

        {/* Book Notes Section */}
        {id && (
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <BookNotes bookId={id} />
          </Box>
        )}
      </Box>

      {/* Delete dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background: "rgba(18,18,32,0.98)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            minWidth: 360,
          },
        }}
      >
        <DialogTitle
          sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, pt: 3, pb: 1 }}
        >
          Delete book?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.88rem",
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
              "{book.title}"
            </span>{" "}
            will be permanently removed from your library.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "rgba(255,255,255,0.4)",
              borderRadius: "8px",
              "&:hover": { background: "rgba(255,255,255,0.05)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleteBook.isPending}
            sx={{
              background: "linear-gradient(135deg, #ff4444, #cc2222)",
              color: "white",
              fontWeight: 700,
              borderRadius: "8px",
              px: 2.5,
              "&:hover": {
                background: "linear-gradient(135deg, #ff5555, #dd3333)",
              },
            }}
          >
            {deleteBook.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookPage;
