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
import BookIcon from "@mui/icons-material/MenuBook";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

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

  // Get user's name from Google metadata or email
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  // Get initials for avatar
  const getInitials = () => {
    const name = getUserDisplayName();
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          width: "100%",
          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.2)",
        }}
      >
        <Toolbar disableGutters sx={{ py: 1.5, px: { xs: 2, md: 4 } }}>
          <BookIcon sx={{ mr: 2, fontSize: 28, color: "white" }} />
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "white",
              fontWeight: 700,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            📚 Book Tracker
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{
              color: "white",
              fontWeight: 600,
              mr: 1,
              transition: "all 0.3s ease",
              position: "relative",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
              },
            }}
          >
            Login
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            component={Link}
            to="/signup"
            sx={{
              color: "white",
              borderColor: "white",
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                borderColor: "white",
              },
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        width: "100%",
        boxShadow: "0 10px 30px rgba(102, 126, 234, 0.2)",
      }}
    >
      <Toolbar disableGutters sx={{ py: 1.5, px: { xs: 2, md: 4 } }}>
        <BookIcon sx={{ mr: 2, fontSize: 28, color: "white" }} />
        <Typography
          variant="h5"
          component={Link}
          to="/dashboard"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "white",
            fontWeight: 700,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          📚 Book Tracker
        </Typography>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3,
          }}
        >
          <Button
            color="inherit"
            onClick={() => handleNavigation("/dashboard")}
            sx={{
              color: "white",
              fontWeight: 600,
              transition: "all 0.3s ease",
              position: "relative",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                "&::after": {
                  width: "100%",
                },
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 0,
                height: 2,
                backgroundColor: "rgba(255,255,255,0.5)",
                transition: "width 0.3s ease",
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation("/add")}
            sx={{
              color: "white",
              fontWeight: 600,
              transition: "all 0.3s ease",
              position: "relative",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                "&::after": {
                  width: "100%",
                },
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 0,
                height: 2,
                backgroundColor: "rgba(255,255,255,0.5)",
                transition: "width 0.3s ease",
              },
            }}
          >
            Add Book
          </Button>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              ml: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.15) rotate(5deg)",
              },
            }}
            title={getUserDisplayName()}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
                border: "2px solid rgba(255,255,255,0.4)",
                transition: "all 0.3s ease",
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
              elevation: 0,
              sx: {
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                mt: 1.5,
                borderRadius: "8px",
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                pointerEvents: "none",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {getUserDisplayName()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "error.main",
                fontWeight: 600,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton onClick={handleMobileMenuOpen} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileAnchorEl}
            open={Boolean(mobileAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                mt: 1.5,
                borderRadius: "8px",
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                pointerEvents: "none",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                  src={user.user_metadata?.avatar_url}
                >
                  {getInitials()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {getUserDisplayName()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleNavigation("/dashboard")}>
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/add")}>
              Add Book
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "error.main",
                fontWeight: 600,
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
