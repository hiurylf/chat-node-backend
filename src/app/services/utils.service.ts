import { Response } from 'express';

export function handleResponseError(
  response: Response,
  error: unknown | Error | any,
): Response {
  const status = typeof error?.message === 'string' ? 400 : 500;

  return response.status(status).json({ error: error?.message || error });
}
