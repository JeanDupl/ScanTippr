// This file previously handled Peach Payments webhooks.
// Peach was sandbox-only and never went live.
// Ozow webhooks are now handled at /api/ozow/webhook
export async function POST() {
  return Response.json({ message: 'This endpoint is deprecated. Use /api/ozow/webhook' }, { status: 410 });
}
