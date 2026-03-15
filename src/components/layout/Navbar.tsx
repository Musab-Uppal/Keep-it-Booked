import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BookIcon from "@mui/icons-material/AutoStories";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMobileAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    return user?.email?.split("@")[0] || "User";
  };

  const getInitials = () => {
    const name = getUserDisplayName();
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const navbarSx = {
    background: "rgba(10, 10, 20, 0.75)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    borderBottom: "1px solid rgba(255, 200, 80, 0.1)",
    boxShadow: "0 4px 40px rgba(0,0,0,0.4)",
  };

  if (!user) {
    return (
      <AppBar position="sticky" elevation={0} sx={navbarSx}>
        <Toolbar disableGutters sx={{ py: 1, px: { xs: 2, md: 5 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexGrow: 1,
            }}
          >
            <BookIcon sx={{ fontSize: 26, color: "#FFC850" }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "1.1rem",
                letterSpacing: "-0.02em",
                background: "linear-gradient(90deg, #FFC850, #FF8C42)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Georgia', serif",
              }}
            >
              Bookshelf
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              component={Link}
              to="/login"
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.02em",
                px: 2,
                py: 0.75,
                borderRadius: "8px",
                transition: "all 0.2s",
                "&:hover": {
                  color: "#FFC850",
                  background: "rgba(255,200,80,0.08)",
                },
              }}
            >
              Sign in
            </Button>
            <Button
              component={Link}
              to="/signup"
              sx={{
                background: "linear-gradient(135deg, #FFC850, #FF8C42)",
                color: "#0a0a14",
                fontWeight: 700,
                fontSize: "0.85rem",
                px: 2.5,
                py: 0.75,
                borderRadius: "8px",
                transition: "all 0.25s",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 20px rgba(255,200,80,0.3)",
                },
              }}
            >
              Get started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="sticky" elevation={0} sx={navbarSx}>
      <Toolbar disableGutters sx={{ py: 1, px: { xs: 2, md: 5 } }}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}
        >
          <BookIcon sx={{ fontSize: 26, color: "#FFC850" }} />
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.02em",
              background: "linear-gradient(90deg, #FFC850, #FF8C42)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Georgia', serif",
            }}
          >
            Bookshelf
          </Typography>
        </Box>

        {/* Desktop */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {[{ label: "Add Book", path: "/add" }].map(({ label, path }) => (
            <Button
              key={path}
              onClick={() => handleNavigation(path)}
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontWeight: 600,
                fontSize: "0.85rem",
                px: 2,
                borderRadius: "8px",
                transition: "all 0.2s",
                "&:hover": {
                  color: "#FFC850",
                  background: "rgba(255,200,80,0.08)",
                },
              }}
            >
              {label}
            </Button>
          ))}
          <Box
            sx={{
              width: "1px",
              height: 24,
              background: "rgba(255,255,255,0.1)",
              mx: 1.5,
            }}
          />
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar
              sx={{
                width: 34,
                height: 34,
                background: "linear-gradient(135deg, #FFC850, #FF8C42)",
                color: "#0a0a14",
                fontWeight: 800,
                fontSize: "0.75rem",
                border: "2px solid rgba(255,200,80,0.3)",
              }}
              src={user.user_metadata?.avatar_url}
            >
              {getInitials()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: "12px",
                background: "rgba(18, 18, 32, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,200,80,0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                minWidth: 200,
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                py: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.9rem",
                }}
              >
                {getUserDisplayName()}
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}
              >
                {user.email}
              </Typography>
            </MenuItem>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#ff6b6b",
                fontWeight: 600,
                fontSize: "0.85rem",
                borderRadius: "8px",
                mx: 0.5,
                my: 0.25,
                "&:hover": { background: "rgba(255,107,107,0.1)" },
              }}
            >
              Sign out
            </MenuItem>
          </Menu>
        </Box>

        {/* Mobile */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            onClick={handleMobileMenuOpen}
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileAnchorEl}
            open={Boolean(mobileAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: "12px",
                background: "rgba(18,18,32,0.98)",
                border: "1px solid rgba(255,200,80,0.1)",
                minWidth: 200,
              },
            }}
          >
            <MenuItem disabled sx={{ py: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    background: "linear-gradient(135deg,#FFC850,#FF8C42)",
                    color: "#0a0a14",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                  }}
                >
                  {getInitials()}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {getUserDisplayName()}
                  </Typography>
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />
            <MenuItem
              onClick={() => handleNavigation("/dashboard")}
              sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}
            >
              Library
            </MenuItem>
            <MenuItem
              onClick={() => handleNavigation("/add")}
              sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}
            >
              Add Book
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{ color: "#ff6b6b", fontWeight: 600, fontSize: "0.85rem" }}
            >
              Sign out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
