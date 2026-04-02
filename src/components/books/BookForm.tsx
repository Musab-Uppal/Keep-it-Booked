import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextField,
  Button,
  Rating,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Link } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { BookFormData } from "../../types";

const bookSchema = z.object({
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  title: z.string().min(1, "Book name is required"),
  rating: z.number().min(1, "Rating is required").max(5),
  date_read: z.date(),
});

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => void;
  isSubmitting: boolean;
  submitButtonText: string;
}

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
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.85rem",
    "&.Mui-focused": { color: "#FFC850" },
  },
  "& .MuiFormHelperText-root": { color: "#ff6b6b", fontSize: "0.75rem" },
  "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.2)" },
};

const BookForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText,
}: BookFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      isbn: initialData?.isbn || "",
      title: initialData?.title || "",
      rating: initialData?.rating || 3,
      date_read: initialData?.date_read || new Date(),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Book Name"
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={isSubmitting}
              sx={fieldSx}
            />
          )}
        />

        <Controller
          name="isbn"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="ISBN"
              error={!!errors.isbn}
              helperText={errors.isbn?.message}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title="What is ISBN?">
                      <IconButton
                        component={Link}
                        to="/what-is-isbn"
                        size="small"
                        edge="start"
                        sx={{ color: "rgba(255,200,80,0.85)" }}
                      >
                        <HelpOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={fieldSx}
            />
          )}
        />

        {/* Rating */}
        <Box>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.4)",
              mb: 0.5,
              letterSpacing: "0.05em",
            }}
          >
            RATING
          </Typography>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <Rating
                {...field}
                onChange={(_, value) => field.onChange(value)}
                disabled={isSubmitting}
                sx={{
                  "& .MuiRating-iconFilled": { color: "#FFC850" },
                  "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.2)" },
                  "& .MuiRating-iconHover": { color: "#FFD870" },
                  fontSize: "1.5rem",
                }}
              />
            )}
          />
          {errors.rating && (
            <Typography sx={{ color: "#ff6b6b", fontSize: "0.75rem", mt: 0.4 }}>
              {errors.rating.message}
            </Typography>
          )}
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Controller
            name="date_read"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date Read"
                value={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
                sx={fieldSx}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date_read,
                    helperText: errors.date_read?.message,
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>

        <Button
          type="submit"
          disabled={isSubmitting}
          sx={{
            mt: 1,
            py: 1.5,
            background: isSubmitting
              ? "rgba(255,200,80,0.3)"
              : "linear-gradient(135deg, #FFC850, #FF8C42)",
            color: "#0a0a14",
            fontWeight: 800,
            fontSize: "0.9rem",
            borderRadius: "10px",
            letterSpacing: "0.02em",
            transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 10px 30px rgba(255,200,80,0.3)",
              background: "linear-gradient(135deg, #FFD060, #FF9C52)",
            },
            "&:disabled": { color: "rgba(10,10,20,0.5)" },
          }}
        >
          {isSubmitting ? "Saving…" : submitButtonText}
        </Button>
      </Box>
    </form>
  );
};

export default BookForm;
