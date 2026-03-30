import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Box, CircularProgress, Typography } from "@mui/material";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        const oauthError =
          searchParams.get("error") || searchParams.get("error_description");

        if (oauthError) {
          console.error("OAuth callback returned an error:", oauthError);
          navigate("/login", { replace: true });
          return;
        }

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("Auth callback error:", error || "No session found");
          navigate("/login", { replace: true });
          return;
        }

        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Auth callback handling failed:", error);
        navigate("/login", { replace: true });
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
