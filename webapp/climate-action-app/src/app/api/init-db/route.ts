export async function GET() {
  try {
    return new Response('Database initialized successfully', {
      status: 200,
    });
  } catch (error) {
    return new Response('Error initializing database: ' + error, {
      status: 500,
    });
  }
}
