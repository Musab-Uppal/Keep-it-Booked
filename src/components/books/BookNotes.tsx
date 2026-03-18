import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { BookNote } from "../../types";
import { useNotes } from "../../hooks/useNotes";
import { summarizeNotes } from "../../services/groqService";
import { format } from "date-fns";

interface BookNotesProps {
  bookId: string;
}

const BookNotes = ({ bookId }: BookNotesProps) => {
  const { notes, isLoading, addNote, updateNote, deleteNote } =
    useNotes(bookId);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizeError, setSummarizeError] = useState<string | null>(null);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [summarizedContent, setSummarizedContent] = useState<string>("");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const handleAddNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      alert("Please fill in both title and content");
      return;
    }
    await addNote.mutateAsync({
      bookId,
      title: newNoteTitle,
      content: newNoteContent,
    });
    setNewNoteTitle("");
    setNewNoteContent("");
    setIsAddingNote(false);
  };

  const handleEditNote = async () => {
    if (!editingId || !editTitle.trim() || !editContent.trim()) {
      alert("Please fill in both title and content");
      return;
    }
    await updateNote.mutateAsync({
      id: editingId,
      title: editTitle,
      content: editContent,
    });
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleDeleteNote = async () => {
    if (deleteConfirmId) {
      await deleteNote.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleStartEdit = (note: BookNote) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSummarizeAllNotes = async () => {
    if (!notes || notes.length === 0) {
      setSummarizeError("No notes to summarize");
      return;
    }

    const allContent = notes
      .map((note) => `# ${note.title}\n${note.content}`)
      .join("\n\n");

    if (allContent.length < 300) {
      setSummarizeError(
        "Total notes content is too short to summarize (minimum 300 characters)",
      );
      return;
    }

    setIsSummarizing(true);
    setSummarizeError(null);
    try {
      const summarized = await summarizeNotes(allContent);
      setSummarizedContent(summarized);
      setSummaryDialogOpen(true);
    } catch (error) {
      setSummarizeError(
        error instanceof Error ? error.message : "Failed to summarize notes",
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const toggleNoteExpanded = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Notes ({notes?.length || 0})
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {notes && notes.length > 0 && (
            <Button
              startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
              onClick={handleSummarizeAllNotes}
              disabled={isSummarizing}
              sx={{
                color: "rgba(255,200,80,0.8)",
                border: "1px solid rgba(255,200,80,0.2)",
                borderRadius: "10px",
                px: 1.5,
                py: 0.6,
                fontSize: "0.75rem",
                fontWeight: 600,
                transition: "all 0.2s",
                "&:hover": {
                  color: "#FFC850",
                  borderColor: "rgba(255,200,80,0.4)",
                  background: "rgba(255,200,80,0.06)",
                },
              }}
            >
              {isSummarizing ? "Summarizing..." : "Summarize All"}
            </Button>
          )}
          <Button
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => setIsAddingNote(!isAddingNote)}
            sx={{
              color: "rgba(255,200,80,0.8)",
              border: "1px solid rgba(255,200,80,0.2)",
              borderRadius: "10px",
              px: 1.5,
              py: 0.6,
              fontSize: "0.75rem",
              fontWeight: 600,
              transition: "all 0.2s",
              "&:hover": {
                color: "#FFC850",
                borderColor: "rgba(255,200,80,0.4)",
                background: "rgba(255,200,80,0.06)",
              },
            }}
          >
            {isAddingNote ? "Cancel" : "Add Note"}
          </Button>
        </Box>
      </Box>

      {/* Error Messages */}
      {summarizeError && (
        <Alert
          severity="error"
          onClose={() => setSummarizeError(null)}
          sx={{ mb: 2 }}
        >
          {summarizeError}
        </Alert>
      )}

      {/* Add Note Form */}
      <Collapse in={isAddingNote} sx={{ mb: 2 }}>
        <Card
          sx={{
            p: 2,
            background: "rgba(255,200,80,0.04)",
            border: "1px solid rgba(255,200,80,0.1)",
            borderRadius: "12px",
          }}
        >
          <TextField
            fullWidth
            placeholder="Note title (e.g., Chapter 1, Main Themes)"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                color: "rgba(255,255,255,0.8)",
                "& fieldset": {
                  borderColor: "rgba(255,200,80,0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,200,80,0.4)",
                },
              },
              "& .MuiOutlinedInput-input::placeholder": {
                color: "rgba(255,255,255,0.3)",
                opacity: 1,
              },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Note content..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                color: "rgba(255,255,255,0.8)",
                "& fieldset": {
                  borderColor: "rgba(255,200,80,0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,200,80,0.4)",
                },
              },
              "& .MuiOutlinedInput-input::placeholder": {
                color: "rgba(255,255,255,0.3)",
                opacity: 1,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddNote}
            disabled={addNote.isPending}
            sx={{
              background: "linear-gradient(135deg, #FFC850, #FFB700)",
              color: "#000",
              fontWeight: 700,
              borderRadius: "10px",
              px: 2,
              "&:hover": {
                background: "linear-gradient(135deg, #FFD699, #FFC850)",
              },
            }}
          >
            {addNote.isPending ? "Adding..." : "Add Note"}
          </Button>
        </Card>
      </Collapse>

      {/* Loading state */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress size={30} />
        </Box>
      )}

      {/* Notes List */}
      {!isLoading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {notes && notes.length > 0 ? (
            notes.map((note) => (
              <Card
                key={note.id}
                sx={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {editingId === note.id ? (
                  // Edit Mode
                  <Box sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Note title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      sx={{
                        mb: 1.5,
                        "& .MuiOutlinedInput-root": {
                          color: "rgba(255,255,255,0.8)",
                          "& fieldset": {
                            borderColor: "rgba(255,200,80,0.2)",
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Note content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          color: "rgba(255,255,255,0.8)",
                          "& fieldset": {
                            borderColor: "rgba(255,200,80,0.2)",
                          },
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={handleEditNote}
                        disabled={updateNote.isPending}
                        sx={{
                          background:
                            "linear-gradient(135deg, #FFC850, #FFB700)",
                          color: "#000",
                          fontWeight: 700,
                          borderRadius: "10px",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #FFD699, #FFC850)",
                          },
                        }}
                      >
                        {updateNote.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(null);
                          setEditTitle("");
                          setEditContent("");
                        }}
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "10px",
                          "&:hover": {
                            background: "rgba(255,255,255,0.05)",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  // View Mode
                  <Box>
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        "&:hover": {
                          background: "rgba(255,255,255,0.04)",
                        },
                        transition: "background 0.2s",
                      }}
                    >
                      <Box
                        sx={{ flex: 1, cursor: "pointer" }}
                        onClick={() => toggleNoteExpanded(note.id)}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "rgba(255,200,80,0.9)",
                            fontSize: "0.95rem",
                            mb: 0.5,
                          }}
                        >
                          {note.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.3)",
                          }}
                        >
                          {format(
                            new Date(note.created_at),
                            "MMM d, yyyy h:mm a",
                          )}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          ml: 1,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                          onClick={() => handleStartEdit(note)}
                          size="small"
                          sx={{
                            color: "rgba(255,200,80,0.8)",
                            border: "1px solid rgba(255,200,80,0.2)",
                            borderRadius: "8px",
                            px: 1.2,
                            py: 0.5,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            transition: "all 0.2s",
                            "&:hover": {
                              color: "#FFC850",
                              borderColor: "rgba(255,200,80,0.4)",
                              background: "rgba(255,200,80,0.06)",
                            },
                          }}
                        >
                          Edit
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteConfirmId(note.id)}
                          sx={{
                            color: "rgba(255,100,100,0.6)",
                            "&:hover": {
                              color: "#ff6b6b",
                              background: "rgba(255,100,100,0.1)",
                            },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: "rgba(255,255,255,0.3)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNoteExpanded(note.id);
                          }}
                        >
                          {expandedNotes.has(note.id) ? (
                            <ExpandLessIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <ExpandMoreIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Expanded Content */}
                    <Collapse in={expandedNotes.has(note.id)}>
                      <Box
                        sx={{
                          px: 2,
                          pb: 2,
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                          pt: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.9rem",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {note.content}
                        </Typography>
                      </Box>
                    </Collapse>
                  </Box>
                )}
              </Card>
            ))
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.3)",
                py: 3,
                fontSize: "0.9rem",
              }}
            >
              No notes yet. Add your first note to get started!
            </Typography>
          )}
        </Box>
      )}

      {/* Summary Dialog */}
      <Dialog
        open={summaryDialogOpen}
        onClose={() => {
          setSummaryDialogOpen(false);
          setSummarizedContent("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "rgba(255,255,255,0.9)" }}>
          Summary of All Notes
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              mt: 2,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {summarizedContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSummaryDialogOpen(false);
              setSummarizedContent("");
            }}
            sx={{ color: "rgba(255,255,255,0.5)" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this note?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteNote}
            disabled={deleteNote.isPending}
            color="error"
            variant="contained"
          >
            {deleteNote.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookNotes;
