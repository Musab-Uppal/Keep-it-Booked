import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
  Chip,
  Divider,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AutoAwesome as AutoAwesomeIcon } from "@mui/icons-material";

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
    <Card sx={{ animation: "fadeIn 0.5s ease-out" }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        <CardMedia
          component="img"
          sx={{
            width: { xs: "100%", md: 300 },
            height: { xs: 300, md: "auto" },
            objectFit: "contain",
            p: 2,
            bgcolor: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            transition: "all 0.3s ease",
          }}
          image={book.cover_url || "/placeholder-book.jpg"}
          alt={book.title}
        />

        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {book.title}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip
              label={`ISBN: ${book.isbn}`}
              variant="outlined"
              sx={{
                background:
                  "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
                borderColor: "primary.light",
              }}
            />
            <Chip
              label={`Read: ${format(new Date(book.date_read), DATE_FORMAT)}`}
              variant="outlined"
              sx={{
                background:
                  "linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)",
                borderColor: "secondary.light",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Rating value={book.rating} readOnly size="large" />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              {book.rating}/5 ⭐
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ m: 0, fontWeight: 700 }}
            >
              Notes
            </Typography>
            {!isEditing && book.notes && book.notes.length >= 300 && (
              <Button
                size="small"
                variant="outlined"
                startIcon={
                  isSummarizing ? (
                    <CircularProgress size={18} />
                  ) : (
                    <AutoAwesomeIcon />
                  )
                }
                onClick={handleSummarizeNotes}
                disabled={isSummarizing}
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                {isSummarizing ? "Summarizing..." : "Summarize"}
              </Button>
            )}
          </Box>

          {summarizeError && (
            <Alert
              severity="error"
              sx={{ mb: 2, animation: "slideInLeft 0.3s ease-out" }}
            >
              {summarizeError}
            </Alert>
          )}

          {isEditing ? (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                background:
                  "linear-gradient(135deg, rgba(240, 249, 255, 0.5) 0%, rgba(224, 242, 254, 0.5) 100%)",
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isUpdating || isSummarizing}
                placeholder="Add your notes about this book..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveNotes}
                  disabled={isUpdating}
                  sx={{
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {isUpdating ? "Saving..." : "Save Notes"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setNotes(book.notes || "");
                    setIsEditing(false);
                    setSummarizeError(null);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                minHeight: 120,
                cursor: book.notes ? "pointer" : "default",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(240, 249, 255, 0.5) 100%)",
                border: "1px solid rgba(229, 231, 235, 0.6)",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "rgba(240, 249, 255, 0.8)",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
                },
              }}
              onClick={() => book.notes && setIsEditing(true)}
            >
              {book.notes ? (
                <Typography
                  variant="body1"
                  whiteSpace="pre-wrap"
                  sx={{
                    lineHeight: 1.8,
                    color: "text.primary",
                  }}
                >
                  {book.notes}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ py: 3 }}
                >
                  Click to add notes...
                </Typography>
              )}
            </Paper>
          )}
        </CardContent>
      </Box>

      {/* Summary Dialog */}
      <Dialog
        open={summaryDialogOpen}
        onClose={handleCloseSummaryDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.95) 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.3rem",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          📝 Summary Preview
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography
            variant="body1"
            whiteSpace="pre-wrap"
            sx={{
              lineHeight: 1.8,
              color: "text.primary",
              pt: 2,
            }}
          >
            {summarizedContent}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseSummaryDialog} variant="outlined">
            Discard
          </Button>
          <Button
            onClick={handleUseSummary}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            }}
          >
            Use Summary
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default BookDetails;
