const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

export const summarizeNotes = async (notes: string): Promise<string> => {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key not configured");
  }

  if (notes.length < 300) {
    // If notes are short, return as is
    return notes;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert summarizer. Summarize the following book notes concisely while preserving key insights and important points. Keep the summary to about 150-200 words.",
            },
            {
              role: "user",
              content: `Please summarize these book notes:\n\n${notes}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error summarizing notes with Groq:", error);
    throw error;
  }
};
