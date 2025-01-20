import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import postgres from 'postgres';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY ?? '', // Pastikan environment variable terdefinisi
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
    const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

    // Ambil data dari tabel knowledge_base
    const result = await sql`SELECT data FROM knowledge_base LIMIT 1`;
    const knowledgeBaseContent = result[0]?.data ? JSON.stringify(result[0].data) : "";

    // Tutup koneksi
    await sql.end();

    // Dapatkan bulan dan tahun sekarang
    const now = new Date();
    const formattedDate = now.toLocaleString('id-ID', {
      month: 'long', // Nama bulan (contoh: "April")
      year: 'numeric', // Tahun (contoh: "2024")
    });

    // Kirim data ke Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
            Anda adalah chatbot virtual assistant yang menggantikan wahyu untuk menjawab pertanyaan dari orang lain. 
            Wahyu lebih menyukai jawaban yang singkat, padat, jelas, namun tetap ramah. Berikut adalah beberapa aturan penting yang harus Anda ikuti:
            
            1. Jawablah berdasarkan informasi yang tersedia di knowledge base berikut:
               \n\n${knowledgeBaseContent}
            2. Jika tidak mengetahui jawaban, katakan dengan sopan: "Maaf, saya tidak tahu."
            3. Jika pertanyaan bersifat terlalu pribadi, sensitif, atau toxic, balas dengan: "Maaf, saya tidak bisa menjawab pertanyaan seperti itu."
            4. Semua jawaban harus dalam format teks biasa, bukan markdown.
    
            Informasi tambahan untuk konteks waktu saat ini:
            Tanggal: ${formattedDate}
            
            Pastikan Anda menyapa pengguna dengan hangat di awal, memberikan jawaban yang membantu, dan menutup percakapan dengan ramah.
          `,
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