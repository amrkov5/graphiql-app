'use client';

export function saveRequestToHistory(requestData: {
  method: string;
  fullUrl: string;
  headers: Record<string, string>;
  body: string | null;
}) {
  const currentUrl = window.location.href;
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
  return JSON.parse(localStorage.getItem('requestHistory') || '{}');
}
