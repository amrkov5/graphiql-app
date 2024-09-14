import { NextRequest, NextResponse } from 'next/server';
import { getIntrospectionQuery } from 'graphql';

export async function POST(req: NextRequest) {
  try {
    const { method, fullUrl, headers, body, variables } = await req.json();
    let response;
    if (method === 'DOCS') {
      response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: getIntrospectionQuery() }),
      });
    } else if (method) {
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
        body: JSON.stringify({ query, variables }),
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
