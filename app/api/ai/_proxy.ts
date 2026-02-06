import { NextResponse } from 'next/server';

const PY_API_URL = process.env.NEXT_PUBLIC_PY_API_URL || 'http://localhost:8001';

export async function proxyToPython(req: Request, path: string) {
  const url = `${PY_API_URL}${path}`;
  const auth = req.headers.get('authorization');
  const body = req.method === 'GET' ? undefined : await req.text();

  const res = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: auth } : {}),
    },
    body,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') || 'application/json',
    },
  });
}
