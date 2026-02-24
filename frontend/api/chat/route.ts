import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  // Retrieve the authenticated user from the request.
  // In a real application, this would come from your authentication middleware (e.g., NextAuth, Clerk, etc.)
  // We simulate it here by checking a header, as req.user is not standard on Request.
  const authenticatedUserId = req.headers.get('x-user-id');

  // Check if the user is authorized
  if (!authenticatedUserId || userId !== authenticatedUserId) {
    return Response.json(
      { error: 'Unauthorized' }, { status: 401 }
    );
  }

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
