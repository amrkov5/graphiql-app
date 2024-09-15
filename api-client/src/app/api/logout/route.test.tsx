import { POST } from './route';

global.fetch = vi.fn();

const mockCookies = () => {
  return {
    get: () => {
      return null;
    },
    set: () => {
      return {
        name: 'session',
        value: '',
        maxAge: -1,
      };
    },
  };
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: mockCookies,
    set: mockCookies,
  })),
}));

describe('should test logout', () => {
  it('should call logout route', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () => Promise.resolve({ message: 'Success' }),
      status: 200,
    });

    const response = await POST();

    expect(response.status).toBe(200);
  });
});
