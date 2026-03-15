import { useState } from "react";
import {
  Typography,
  Rating,
  Box,
  Chip,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AutoAwesome as AutoAwesomeIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import { Book } from "../../types";
import { DATE_FORMAT } from "../../lib/constants";
import { summarizeNotes } from "../../services/groqService";

interface BookDetailsProps {
  book: Book;
  onUpdateNotes: (notes: string) => void;
  isUpdating: boolean;
}

const BookDetails = ({ book, onUpdateNotes, isUpdating }: BookDetailsProps) => {
  const [notes, setNotes] = useState(book.notes || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizeError, setSummarizeError] = useState<string | null>(null);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [summarizedContent, setSummarizedContent] = useState<string>("");

  const handleSaveNotes = () => {
    onUpdateNotes(notes);
    setIsEditing(false);
  };

  const handleSummarizeNotes = async () => {
    if (!book.notes || book.notes.length < 300) {
      setSummarizeError(
        "Notes are too short to summarize (minimum 300 characters)",
      );
      return;
    }
    setIsSummarizing(true);
    setSummarizeError(null);
    try {
      const summarized = await summarizeNotes(book.notes);
      setSummarizedContent(summarized);
      setSummaryDialogOpen(true);
    } catch (error) {
      setSummarizeError(
        error instanceof Error ? error.message : "Failed to summarize notes",
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleUseSummary = () => {
    setNotes(summarizedContent);
    setSummaryDialogOpen(false);
    setIsEditing(true);
  };
  const handleCloseSummaryDialog = () => {
    setSummaryDialogOpen(false);
    setSummarizedContent("");
  };

  return (
    <Box>
      {/* Hero section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1.5, md: 2.5 },
          mb: 2.5,
        }}
      >
        {/* Cover */}
        <Box
          sx={{
            width: { xs: "100%", md: 160 },
            flexShrink: 0,
            borderRadius: "14px",
            overflow: "hidden",
            height: { xs: 200, md: 240 },
            position: "relative",
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          {book.cover_url && (
            <img
              src={book.cover_url}
              alt={book.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {!book.cover_url && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography sx={{ fontSize: "4rem" }}>📖</Typography>
            </Box>
          )}
        </Box>

        {/* Info */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#FFC850",
              textTransform: "uppercase",
              mb: 1,
              opacity: 0.8,
            }}
          >
            Book Details
          </Typography>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.4rem", md: "1.7rem" },
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              mb: 2,
              fontFamily: "'Georgia', serif",
            }}
          >
            {book.title}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Rating
              value={book.rating}
              readOnly
              size="small"
              sx={{
                "& .MuiRating-iconFilled": { color: "#FFC850" },
                "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.15)" },
              }}
            />
            <Typography
              sx={{
                color: "rgba(255,200,80,0.9)",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              {book.rating}/5
            </Typography>
          </Box>

          {/* Chips */}
          <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
            <Chip
              label={`ISBN: ${book.isbn}`}
              size="small"
              sx={{
                background: "rgba(255,200,80,0.08)",
                border: "1px solid rgba(255,200,80,0.2)",
                color: "rgba(255,200,80,0.8)",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            />
            <Chip
              label={`Read ${format(new Date(book.date_read), DATE_FORMAT)}`}
              size="small"
              sx={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.65rem",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Notes section */}
      <Box
        sx={{
          p: { xs: 1.5, md: 2 },
          borderRadius: "14px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Notes
          </Typography>
          <Box sx={{ display: "flex", gap: 0.7 }}>
            {!isEditing && book.notes && book.notes.length >= 300 && (
              <Button
                size="small"
                startIcon={
                  isSummarizing ? (
                    <CircularProgress size={14} sx={{ color: "#FFC850" }} />
                  ) : (
                    <AutoAwesomeIcon sx={{ fontSize: 14 }} />
                  )
                }
                onClick={handleSummarizeNotes}
                disabled={isSummarizing}
                sx={{
                  color: "#FFC850",
                  border: "1px solid rgba(255,200,80,0.3)",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  px: 1.5,
                  py: 0.5,
                  fontWeight: 600,
                  "&:hover": {
                    background: "rgba(255,200,80,0.08)",
                    borderColor: "rgba(255,200,80,0.5)",
                  },
                }}
              >
                {isSummarizing ? "Summarizing…" : "Summarize"}
              </Button>
            )}
            {!isEditing && (
              <Button
                size="small"
                startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                onClick={() => setIsEditing(true)}
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  px: 1.5,
                  py: 0.5,
                  "&:hover": {
                    color: "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.04)",
                  },
                }}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>

        {summarizeError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              background: "rgba(255,80,80,0.1)",
              border: "1px solid rgba(255,80,80,0.2)",
              color: "rgba(255,180,180,0.9)",
              borderRadius: "10px",
              "& .MuiAlert-icon": { color: "#ff6b6b" },
            }}
          >
            {summarizeError}
          </Alert>
        )}

        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isUpdating || isSummarizing}
              placeholder="Your thoughts on this book…"
              sx={{
                mb: 1.5,
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover fieldset": { borderColor: "rgba(255,200,80,0.25)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255,200,80,0.5)",
                  },
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                onClick={handleSaveNotes}
                disabled={isUpdating}
                sx={{
                  background: "linear-gradient(135deg, #FFC850, #FF8C42)",
                  color: "#0a0a14",
                  fontWeight: 700,
                  borderRadius: "8px",
                  px: 2,
                  py: 0.5,
                  fontSize: "0.75rem",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 16px rgba(255,200,80,0.25)",
                  },
                  transition: "all 0.2s",
                }}
              >
                {isUpdating ? "Saving…" : "Save Notes"}
              </Button>
              <Button
                onClick={() => {
                  setNotes(book.notes || "");
                  setIsEditing(false);
                  setSummarizeError(null);
                }}
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  "&:hover": { background: "rgba(255,255,255,0.04)" },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            sx={{
              color: book.notes
                ? "rgba(255,255,255,0.6)"
                : "rgba(255,255,255,0.2)",
              fontSize: "0.88rem",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              fontStyle: book.notes ? "normal" : "italic",
              cursor: "text",
              minHeight: 48,
            }}
            onClick={() => setIsEditing(true)}
          >
            {book.notes || "Click to add your notes about this book…"}
          </Typography>
        )}
      </Box>

      {/* Summary Dialog */}
      <Dialog
        open={summaryDialogOpen}
        onClose={handleCloseSummaryDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "rgba(18,18,32,0.98)",
            border: "1px solid rgba(255,200,80,0.15)",
            backdropFilter: "blur(30px)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "rgba(255,255,255,0.9)",
            fontWeight: 700,
            pt: 3,
            pb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AutoAwesomeIcon sx={{ color: "#FFC850", fontSize: 20 }} />
          Summary Preview
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.88rem",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            {summarizedContent}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseSummaryDialog}
            sx={{
              color: "rgba(255,255,255,0.4)",
              borderRadius: "8px",
              "&:hover": { background: "rgba(255,255,255,0.05)" },
            }}
          >
            Discard
          </Button>
          <Button
            onClick={handleUseSummary}
            sx={{
              background: "linear-gradient(135deg, #FFC850, #FF8C42)",
              color: "#0a0a14",
              fontWeight: 700,
              borderRadius: "8px",
              px: 2.5,
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 8px 20px rgba(255,200,80,0.3)",
              },
            }}
          >
            Use Summary
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookDetails;
