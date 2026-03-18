import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { BookNote } from "../types";
import toast from "react-hot-toast";

interface AddNoteData {
  bookId: string;
  title: string;
  content: string;
}

interface UpdateNoteData {
  id: string;
  title: string;
  content: string;
}

export const useNotes = (bookId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: notes,
    isLoading,
    error,
    refetch,
  } = useQuery<BookNote[]>({
    queryKey: ["notes", bookId],
    enabled: !!bookId,
    queryFn: async () => {
      if (!bookId) throw new Error("No book ID provided");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("book_notes")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BookNote[];
    },
  });

  const addNote = useMutation({
    mutationFn: async ({ bookId, title, content }: AddNoteData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("book_notes")
        .insert([
          {
            book_id: bookId,
            user_id: user.id,
            title,
            content,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as BookNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", bookId] });
      toast.success("Note added successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add note");
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, title, content }: UpdateNoteData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("book_notes")
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as BookNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", bookId] });
      toast.success("Note updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update note");
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("book_notes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", bookId] });
      toast.success("Note deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete note");
    },
  });

  return {
    notes,
    isLoading,
    error,
    refetch,
    addNote,
    updateNote,
    deleteNote,
  };
};
