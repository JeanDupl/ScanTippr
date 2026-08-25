import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();

  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('Ozow payout verify received:', JSON.stringify(payload, null, 2));

  // Verify the access token Ozow sends matches ours
  const receivedToken = payload.accessToken ?? request.headers.get('Authorization')?.replace('Bearer ', '');
  const expectedToken = process.env.OZOW_PAYOUT_ACCESS_TOKEN!;

  if (!receivedToken || receivedToken !== expectedToken) {
    console.error('Ozow payout verify: invalid access token');
    return Response.json({ verified: false }, { status: 401 });
  }

  console.log('Ozow payout verify: token valid');
  return Response.json({ verified: true });
}