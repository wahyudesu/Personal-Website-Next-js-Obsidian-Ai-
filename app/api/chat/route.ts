import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import postgres from 'postgres';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Setup koneksi ke Neon
    const sql = postgres(process.env.DATABASE_URL ?? '', { ssl: 'require' });

    // Ambil data dari tabel knowledge_base
    const result = await sql`SELECT data FROM knowledge_base LIMIT 1`;
    const knowledgeBaseContent = result[0] ? JSON.stringify(result[0].data) : "";

    // Tutup koneksi
    await sql.end();

    // Kirim data ke Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
          `Kamu adalah seorang wahyu, orangnya singkat padat dan jelas.
          Berikut adalah pengetahuan yang wahyu miliki:
          \n\n${knowledgeBaseContent} dan jawab sesingkat mungkin.
          Berikan format jawabanmu dalam format teks bukan markdown`,
        },
        { role: "user", content: message },
      ],
      model: "llama-3.1-8b-instant",
    });

    const response = chatCompletion.choices[0].message.content;

    return NextResponse.json({ response: response });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Maaf bot sedang eror, coba lain kali" },
      { status: 500 }
    );
  }
}