export async function POST(req: Request) {
    try {
      const body = await req.json();
      console.log("Form data received:", body);
  
      return new Response(JSON.stringify({ message: "Form submitted successfully" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error("Error in API route:", error);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500
      });
    }
  }
  