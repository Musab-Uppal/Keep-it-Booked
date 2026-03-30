import { Typography, Rating, Box, Chip } from "@mui/material";
import { format } from "date-fns";
import { Book } from "../../types";
import { DATE_FORMAT } from "../../lib/constants";

interface BookDetailsProps {
  book: Book;
}

const BookDetails = ({ book }: BookDetailsProps) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1.5, md: 2.5 },
          mb: 2.5,
        }}
      >
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
              mb: 1,
              fontFamily: "'Georgia', serif",
            }}
          >
            {book.title}
          </Typography>

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
    </Box>
  );
};

export default BookDetails;
