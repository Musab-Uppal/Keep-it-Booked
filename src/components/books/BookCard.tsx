import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  const handleCardClick = () => navigate(`/book/${book.id}`);
  const handleStopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          cursor: "pointer",
          borderRadius: "16px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          "&:hover": {
            transform: "translateY(-8px)",
            border: "1px solid rgba(255,200,80,0.25)",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,200,80,0.1)",
            background: "rgba(255,255,255,0.05)",
            "& .book-cover img": { transform: "scale(1.06)" },
            "& .action-buttons": { opacity: 1, transform: "translateY(0)" },
          },
          "&:active": { transform: "translateY(-4px)" },
        }}
      >
        {/* Cover image */}
        <Box
          className="book-cover"
          sx={{
            position: "relative",
            height: 180,
            overflow: "hidden",
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            image={book.cover_url || "/placeholder-book.jpg"}
            alt={book.title}
          />
          {/* Gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(10,10,20,0.7) 0%, transparent 50%)",
            }}
          />

          {/* Rating badge */}
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              left: 12,
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              px: 1.25,
              py: 0.4,
            }}
          >
            <Typography sx={{ color: "#FFC850", fontSize: "0.65rem" }}>
              ★
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}
            >
              {book.rating}
            </Typography>
          </Box>

          {/* Action buttons */}
          <Box
            className="action-buttons"
            onClick={handleStopPropagation}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 0.6,
              opacity: 0.9,
              transform: "translateY(0)",
              transition: "all 0.25s ease",
            }}
          >
            <IconButton
              size="small"
              onClick={() => navigate(`/edit/${book.id}`)}
              sx={{
                width: 38,
                height: 38,
                background: "#FFC850",
                color: "#0a0a14",
                fontWeight: 700,
                "&:hover": {
                  background: "#FFD870",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <EditIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
              sx={{
                width: 38,
                height: 38,
                background: "#ff6b6b",
                color: "#fff",
                fontWeight: 700,
                "&:hover": {
                  background: "#ff8585",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <DeleteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        <CardContent
          sx={{ flexGrow: 1, p: 1.2, display: "flex", flexDirection: "column" }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.3,
              mb: 0.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              letterSpacing: "-0.01em",
            }}
          >
            {book.title}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.55)",
              mb: 0.6,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            Rating {book.rating}/5
          </Typography>

          <Typography
            sx={{
              fontSize: "0.6rem",
              color: "rgba(255,200,80,0.6)",
              letterSpacing: "0.08em",
              mb: 0.6,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            ISBN {book.isbn}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.3)",
              mt: "auto",
              pt: 0.6,
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {format(new Date(book.date_read), DATE_FORMAT)}
          </Typography>
        </CardContent>
      </Card>

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
              color: "rgba(255,255,255,0.5)",
              borderRadius: "8px",
              "&:hover": { background: "rgba(255,255,255,0.05)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookCard;
