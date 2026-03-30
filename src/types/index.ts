export interface Book {
  id: string;
  isbn: string;
  title: string;
  rating: number;
  notes?: string | null;
  date_read: string;
  cover_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface BookNote {
  id: string;
  book_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
export interface BookFormData {
  isbn: string;
  title: string;
  rating: number;
  date_read: Date;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  session: unknown | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
