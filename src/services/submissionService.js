const apiBaseUrl = import.meta.env.VITE_API_URL || '';

export async function sendSubmission(payload) {
  const response = await fetch(`${apiBaseUrl}/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...payload,
      source: window.location.pathname
    })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.ok) {
    throw new Error(result.message || 'Submission failed.');
  }

  return result;
}
