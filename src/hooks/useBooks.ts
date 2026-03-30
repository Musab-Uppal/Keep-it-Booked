import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabase } from "../lib/supabase";
import { IMG_URL } from "../lib/constants";
import { Book, BookFormData } from "../types";
import toast from "react-hot-toast";

interface UpdateBookData extends Partial<BookFormData> {
  id: string;
}

export const useBooks = () => {
  const queryClient = useQueryClient();

  const {
    data: books,
    isLoading,
    error,
    refetch,
  } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", user.id)
        .order("date_read", { ascending: false });

      if (error) throw error;
      return data as Book[];
    },
  });

  const getBook = useCallback(async (id: string): Promise<Book> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    return data as Book;
  }, []);

  const addBook = useMutation({
    mutationFn: async (bookData: BookFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const book = {
        isbn: bookData.isbn,
        title: bookData.title,
        rating: bookData.rating,
        date_read: bookData.date_read.toISOString().split("T")[0],
        cover_url: `${IMG_URL}/${bookData.isbn}-M.jpg`,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("books")
        .insert([book])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("This book has already been added");
        }
        throw error;
      }
      return data as Book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book added successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add book");
    },
  });

  const updateBook = useMutation({
    mutationFn: async ({ id, ...bookData }: UpdateBookData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const updates = {
        isbn: bookData.isbn,
        title: bookData.title,
        rating: bookData.rating,
        date_read: bookData.date_read?.toISOString().split("T")[0],
        cover_url: `${IMG_URL}/${bookData.isbn}-M.jpg`,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("books")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update book");
    },
  });

  const deleteBook = useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete book");
    },
  });

  return {
    books,
    isLoading,
    error,
    refetch,
    getBook,
    addBook,
    updateBook,
    deleteBook,
  };
};
