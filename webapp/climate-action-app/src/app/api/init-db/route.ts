import { initializeDatabase } from "@/app/db/dbInit";

export async function GET() {
  try {
    await initializeDatabase();
    return new Response('Database initialized successfully', {
      status: 200,
    });
  } catch (error) {
    return new Response('Error initializing database', {
      status: 500,
    });
  }
}
