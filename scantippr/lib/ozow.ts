const OZOW_BASE_URL = 'https://one.ozow.com/v1';

export async function getOzowAccessToken(): Promise<string> {
  const res = await fetch(`${OZOW_BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.OZOW_CLIENT_ID!,
      client_secret: process.env.OZOW_CLIENT_SECRET!,
      scope: 'payments',
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ozow token request failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function createOzowPayment({
  amount,
  merchantReference,
  returnUrl,
  institutionId,
}: {
  amount: number;
  merchantReference: string;
  returnUrl: string;
  institutionId?: string;
}) {
  const token = await getOzowAccessToken();
  const res = await fetch(`${OZOW_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Idempotency-Key': merchantReference,
    },
        body: JSON.stringify({
        siteCode: process.env.OZOW_SITE_CODE,
        region: 'ZA',
        amount: { currency: 'ZAR', value: amount },
        merchantReference,
        beneficiaryReference: merchantReference,
        expireAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        returnUrl,
        ...(institutionId && { institutionId }),
      }),
    });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ozow create payment failed: ${res.status} ${errText}`);
  }

  return res.json();
}

export async function getOzowPaymentTransactions(paymentId: string) {
  const token = await getOzowAccessToken();

  const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const toDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const res = await fetch(
    `${OZOW_BASE_URL}/payments/${paymentId}/transactions?fromDate=${fromDate}&toDate=${toDate}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ozow list transactions failed: ${res.status} ${errText}`);
  }

  return res.json();
}
