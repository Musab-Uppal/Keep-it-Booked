import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Divider,
  Box,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../../hooks/useAuth";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "10px",
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.9rem",
    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
    "&:hover fieldset": { borderColor: "rgba(255,200,80,0.25)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255,200,80,0.5)" },
    "&.Mui-disabled": { opacity: 0.5 },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.88rem",
    "&.Mui-focused": { color: "#FFC850" },
  },
  "& .MuiFormHelperText-root": { color: "#ff6b6b", fontSize: "0.75rem" },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to login with Google",
      );
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        background:
          "linear-gradient(160deg, #0a0a14 0%, #0f0f22 50%, #0d1220 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient glow blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,200,80,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,140,66,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Left branding panel — hidden on mobile */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          px: { md: 8, lg: 12 },
          borderRight: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "#FFC850",
            textTransform: "uppercase",
            mb: 2,
            opacity: 0.8,
          }}
        >
          Bookshelf
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Georgia', serif",
            fontWeight: 800,
            fontSize: { md: "2.8rem", lg: "3.5rem" },
            color: "rgba(255,255,255,0.92)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            mb: 3,
          }}
        >
          Your reading
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #FFC850, #FF8C42)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            life, tracked.
          </span>
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            maxWidth: 360,
          }}
        >
          Keep a record of every book you read, rate them, add notes, and watch
          your library grow.
        </Typography>

        {/* Decorative book stack */}
        <Box sx={{ mt: 6, display: "flex", gap: 1.5 }}>
          {["#3b82f6", "#8b5cf6", "#ec4899", "#FFC850"].map((color, i) => (
            <Box
              key={i}
              sx={{
                width: 10,
                height: 56 + i * 10,
                borderRadius: "3px",
                background: color,
                opacity: 0.35,
                alignSelf: "flex-end",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          width: { xs: "100%", md: "440px" },
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, md: 6 },
          py: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 380,
            animation: "fadeSlideUp 0.5s ease-out",
            "@keyframes fadeSlideUp": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Mobile brand header */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              mb: 4,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Georgia', serif",
                fontWeight: 800,
                fontSize: "1.8rem",
                background: "linear-gradient(90deg, #FFC850, #FF8C42)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Bookshelf
            </Typography>
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.6rem",
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.02em",
              mb: 0.75,
              fontFamily: "'Georgia', serif",
            }}
          >
            Welcome back
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.85rem",
              mb: 3.5,
            }}
          >
            Sign in to your library
          </Typography>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{
                mb: 2.5,
                background: "rgba(255,80,80,0.08)",
                border: "1px solid rgba(255,80,80,0.2)",
                borderRadius: "10px",
                color: "rgba(255,180,180,0.9)",
                fontSize: "0.82rem",
                "& .MuiAlert-icon": { color: "#ff6b6b" },
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleEmailLogin}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                sx={fieldSx}
              />
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.4,
                  background: loading
                    ? "rgba(255,200,80,0.3)"
                    : "linear-gradient(135deg, #FFC850, #FF8C42)",
                  color: "#0a0a14",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  borderRadius: "10px",
                  letterSpacing: "0.02em",
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 30px rgba(255,200,80,0.3)",
                  },
                  "&:disabled": { color: "rgba(10,10,20,0.4)" },
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </Box>
          </form>

          <Divider
            sx={{
              my: 2.5,
              "&::before, &::after": { borderColor: "rgba(255,255,255,0.07)" },
            }}
          >
            <Typography
              sx={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.75rem",
                px: 1,
              }}
            >
              or
            </Typography>
          </Divider>

          <Button
            fullWidth
            startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{
              py: 1.3,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              fontSize: "0.87rem",
              borderRadius: "10px",
              transition: "all 0.2s",
              "&:hover": {
                background: "rgba(255,255,255,0.07)",
                borderColor: "rgba(255,200,80,0.25)",
                color: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Continue with Google
          </Button>

          <Typography
            sx={{
              textAlign: "center",
              mt: 3,
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.82rem",
            }}
          >
            No account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#FFC850",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Sign up free
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
