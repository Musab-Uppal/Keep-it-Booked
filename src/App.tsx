import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import BookPage from "./pages/BookPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AuthCallback from "./components/auth/AuthCallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
      light: "#3b82f6",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#059669",
      light: "#10b981",
      dark: "#047857",
    },
    background: {
      default: "#f0f9ff",
      paper: "#ffffff",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
    info: {
      main: "#3b82f6",
    },
    success: {
      main: "#10b981",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            transform: "translateY(-2px)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #1d4ed8 0%, #1560bd 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          border: "1px solid rgba(229, 231, 235, 0.6)",
          "&:hover": {
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
            transform: "translateY(-8px)",
            background:
              "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.95) 100%)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "all 0.3s ease",
            background: "white",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
            },
            "&.Mui-focused": {
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              background: "rgba(240, 249, 255, 0.5)",
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.2)",
          position: "sticky",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          width: "100%",
          transition: "all 0.3s ease",
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/add"
                element={
                  <PrivateRoute>
                    <AddBook />
                  </PrivateRoute>
                }
              />

              <Route
                path="/edit/:id"
                element={
                  <PrivateRoute>
                    <EditBook />
                  </PrivateRoute>
                }
              />

              <Route
                path="/book/:id"
                element={
                  <PrivateRoute>
                    <BookPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#10b981",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
