import { Alert, AlertTitle, Box, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

const ErrorAlert = ({ message, onRetry }: ErrorAlertProps) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert
        severity="error"
        sx={{
          background: "rgba(255,80,80,0.08)",
          border: "1px solid rgba(255,80,80,0.2)",
          borderRadius: "12px",
          color: "rgba(255,180,180,0.9)",
          "& .MuiAlert-icon": { color: "#ff6b6b" },
          "& .MuiAlertTitle-root": {
            color: "rgba(255,150,150,0.95)",
            fontWeight: 700,
          },
        }}
        action={
          onRetry && (
            <Button
              size="small"
              startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
              onClick={onRetry}
              sx={{
                color: "rgba(255,180,180,0.8)",
                fontSize: "0.75rem",
                "&:hover": { background: "rgba(255,80,80,0.1)" },
              }}
            >
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>Error</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
