import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const WhatIsIsbn = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(160deg, #0a0a14 0%, #0f0f22 50%, #0d1220 100%)",
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "10px",
            width: 34,
            height: 34,
            "&:hover": {
              color: "#FFC850",
              borderColor: "rgba(255,200,80,0.3)",
              background: "rgba(255,200,80,0.06)",
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.05rem", md: "1.2rem" },
            color: "rgba(255,255,255,0.92)",
            fontFamily: "'Georgia', serif",
          }}
        >
          What is ISBN?
        </Typography>
      </Box>

      <Box
        sx={{
          maxWidth: 760,
          p: { xs: 2, md: 2.5 },
          borderRadius: "16px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          display: "flex",
          flexDirection: "column",
          gap: 1.6,
        }}
      >
        <Typography sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
          ISBN stands for International Standard Book Number. It is a unique
          numeric code used to identify a specific book edition.
        </Typography>

        <Typography sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
          Most modern books use a 13-digit ISBN. Older books may have a 10-digit
          ISBN. You can usually find it on the back cover near the barcode or on
          the copyright page inside the book.
        </Typography>

        <Typography sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
          Example formats:
        </Typography>

        <Box sx={{ pl: 1 }}>
          <Typography sx={{ color: "rgba(255,200,80,0.9)", lineHeight: 1.9 }}>
            ISBN-10: 0743273567
          </Typography>
          <Typography sx={{ color: "rgba(255,200,80,0.9)", lineHeight: 1.9 }}>
            ISBN-13: 9780743273565
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WhatIsIsbn;
