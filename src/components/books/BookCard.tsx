import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { Book } from "../../types";
import { DATE_FORMAT } from "../../lib/constants";

interface BookCardProps {
  book: Book;
  onDelete: (id: string) => void;
}

const BookCard = ({ book, onDelete }: BookCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    onDelete(book.id);
    setDeleteDialogOpen(false);
  };

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          border: "1px solid rgba(229, 231, 235, 0.6)",
          "&:hover": {
            "& .book-cover": {
              transform: "scale(1.08)",
              filter: "brightness(1.1)",
            },
            "& .action-buttons": {
              opacity: 1,
            },
            transform: "translateY(-12px) scale(1.02)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            background:
              "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.95) 100%)",
          },
          "&:active": {
            transform: "translateY(-8px) scale(1.01)",
          },
        }}
      >
        <Box
          className="book-cover"
          sx={{
            position: "relative",
            height: 180,
            overflow: "hidden",
            bgcolor: "background.default",
            transition: "transform 0.4s ease, filter 0.4s ease",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            image={book.cover_url || "/placeholder-book.jpg"}
            alt={book.title}
          />
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 0.5,
              opacity: 0,
              transition: "opacity 0.3s ease",
            }}
            className="action-buttons"
          >
            <IconButton
              size="small"
              onClick={handleStopPropagation}
              onClickCapture={() => navigate(`/edit/${book.id}`)}
              sx={{
                bgcolor: "secondary.main",
                color: "white",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "secondary.dark",
                  transform: "scale(1.1)",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
              sx={{
                bgcolor: "error.main",
                color: "white",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "error.dark",
                  transform: "scale(1.1)",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              color: "text.primary",
            }}
          >
            {book.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Rating value={book.rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {book.rating}/5
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={`ISBN: ${book.isbn}`}
              size="small"
              variant="outlined"
              sx={{ mr: 1 }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            📅 {format(new Date(book.date_read), DATE_FORMAT)}
          </Typography>

          {book.notes && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {book.notes}
            </Typography>
          )}
        </CardContent>
      </Card>

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
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookCard;
