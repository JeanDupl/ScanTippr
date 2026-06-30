import QRCode from 'qrcode';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ guardId: string }> }
) {
  const { guardId } = await params;
  const url = `https://www.scantippr.co.za/pay/${guardId}`;

  const qrBuffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: 'H',
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  return new Response(qrBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}