'use client';

import { toBase64 } from './safeBase64';

export function saveRequestToHistory(requestData: {
  method: string;
  fullUrl: string;
  headers: Record<string, string>;
  body: string | null;
}) {
  const currentUrl =
    window.location.origin +
    '/' +
    requestData.method +
    '/' +
    toBase64(requestData.fullUrl) +
    '/' +
    toBase64(requestData.body ?? '');
  const requestKey = currentUrl;

  const requestWithUrl = {
    ...requestData,
    savedUrl: currentUrl,
  };

  const history = JSON.parse(localStorage.getItem('requestHistory') || '{}');

  history[requestKey] = requestWithUrl;

  localStorage.setItem('requestHistory', JSON.stringify(history));
}

export function getHistory() {
  return typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('requestHistory') || '{}')
    : {};
}
