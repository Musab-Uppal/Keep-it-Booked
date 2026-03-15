import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 2,
        background: "transparent",
      }}
    >
      <CircularProgress size={36} thickness={3} sx={{ color: "#FFC850" }} />
      <Typography
        sx={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.82rem",
          letterSpacing: "0.05em",
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
