import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { method, fullUrl, headers, body } = await req.json();
    let response;
    if (method) {
      response = await fetch(fullUrl, {
        method,
        headers,
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      });
    } else {
      const query = body;
      response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
    }
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
