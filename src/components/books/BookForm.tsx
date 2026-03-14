import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Rating, Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BookFormData } from "../../types";

const bookSchema = z.object({
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  title: z.string().min(1, "Title is required"),
  rating: z.number().min(1, "Rating is required").max(5),
  notes: z.string().optional(),
  date_read: z.date(),
});

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => void;
  isSubmitting: boolean;
  submitButtonText: string;
}

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
      notes: initialData?.notes || "",
      date_read: initialData?.date_read || new Date(),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="isbn"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="ISBN"
            margin="normal"
            error={!!errors.isbn}
            helperText={errors.isbn?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Title"
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <Box sx={{ my: 2 }}>
        <Typography component="legend">Rating</Typography>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Rating
              {...field}
              onChange={(_, value) => field.onChange(value)}
              disabled={isSubmitting}
            />
          )}
        />
        {errors.rating && (
          <Typography color="error" variant="caption">
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
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!errors.date_read,
                  helperText: errors.date_read?.message,
                },
              }}
            />
          )}
        />
      </LocalizationProvider>

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Notes"
            multiline
            rows={4}
            margin="normal"
            disabled={isSubmitting}
          />
        )}
      />

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitButtonText}
        </Button>
      </Box>
    </form>
  );
};

export default BookForm;
