// supabase/functions/get-isbn/index.ts
// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60;

const normalizeIsbn = (value: string): string | null => {
  const digits = value.replace(/\D/g, "");
  const isbn13 = digits.match(/97[89]\d{10}/);
  if (isbn13) return isbn13[0];

  const isbn10 = digits.match(/\d{10}/);
  if (isbn10) return isbn10[0];

  return null;
};

const getIsbnFromDoc = (doc: any): string | null => {
  const isbnList = Array.isArray(doc?.isbn) ? doc.isbn : [];
  for (const value of isbnList) {
    if (typeof value !== "string") continue;
    const normalized = normalizeIsbn(value);
    if (normalized) return normalized;
  }
  return null;
};

const lookupWithOpenLibrary = async (title: string, author: string) => {
  const params = new URLSearchParams();
  if (title?.trim()) params.set("title", title.trim());
  if (author?.trim()) params.set("author", author.trim());
  params.set("limit", "10");

  const response = await fetch(
    `https://openlibrary.org/search.json?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`OpenLibrary returned ${response.status}`);
  }

  const payload = await response.json();
  const docs = Array.isArray(payload?.docs) ? payload.docs : [];

  for (const doc of docs) {
    const isbn = getIsbnFromDoc(doc);
    if (!isbn) continue;

    return {
      title: doc?.title || title || "Unknown Title",
      authors: Array.isArray(doc?.author_name)
        ? doc.author_name
        : author
          ? [author]
          : ["Unknown Author"],
      isbn,
      publishYear: doc?.first_publish_year || null,
      coverId: doc?.cover_i || null,
      coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
      olid:
        Array.isArray(doc?.edition_key) && doc.edition_key.length > 0
          ? doc.edition_key[0]
          : null,
    };
  }

  return null;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        },
      );
    }

    const { title, author } = await req.json();

    if (!title && !author) {
      return new Response(
        JSON.stringify({ success: false, error: "Title or author is required" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        },
      );
    }

    const searchQuery = `${title || ""}|${author || ""}`.toLowerCase().trim();
    const cacheKey = `search:${searchQuery}`;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return new Response(JSON.stringify(cached.data), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const matchedBook = await lookupWithOpenLibrary(title || "", author || "");
    const books = matchedBook ? [matchedBook] : [];

    const result = {
      success: true,
      books,
      meta: {
        total: books.length,
        query: searchQuery,
        provider: "openlibrary",
      },
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in get-isbn function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch book data",
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
});
