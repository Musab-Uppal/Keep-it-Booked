import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Box, CircularProgress, Typography } from "@mui/material";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
      } else {
        navigate("/dashboard");
      }
    };
    handleAuthCallback();
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        gap: 2,
        background:
          "linear-gradient(160deg, #0a0a14 0%, #0f0f22 50%, #0d1220 100%)",
      }}
    >
      <CircularProgress size={32} thickness={3} sx={{ color: "#FFC850" }} />
      <Typography
        sx={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.82rem",
          letterSpacing: "0.05em",
        }}
      >
        Completing sign in…
      </Typography>
    </Box>
  );
};

export default AuthCallback;
