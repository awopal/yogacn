import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHttpClient, HttpError } from './client';

afterEach(() => vi.unstubAllGlobals());

describe('http client', () => {
  it('returns parsed data and keeps toast options out of fetch', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await createHttpClient().request<{ ok: boolean }>('/api/example', {
      successToast: { title: 'Done' },
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith('/api/example', {});
  });

  it('throws HttpError with status and API error payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })),
    );

    await expect(createHttpClient().request('/api/example')).rejects.toEqual(
      expect.objectContaining({
        name: 'HttpError',
        message: 'Not found',
        status: 404,
        data: { error: 'Not found' },
      } satisfies Partial<HttpError>),
    );
  });
});
