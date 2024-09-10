import { describe, it, expect, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { POST } from './route';

global.fetch = vi.fn();

describe('POST Handler', () => {
  it('should handle a successful request', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () => Promise.resolve({ message: 'Success' }),
      status: 200,
    });

    const req = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      body: JSON.stringify({
        method: 'POST',
        fullUrl: 'http://example.com',
        headers: { 'Content-Type': 'application/json' },
        body: { key: 'value' },
      }),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ message: 'Success' });
  });

  it('should handle an error from fetch', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Fetch error')
    );

    const req = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      body: JSON.stringify({
        method: 'POST',
        fullUrl: 'http://example.com',
        headers: { 'Content-Type': 'application/json' },
        body: { key: 'value' },
      }),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ error: 'Internal Server Error' });
  });
});
