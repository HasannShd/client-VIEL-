const apiBaseUrl = import.meta.env.VITE_API_URL || '';
const submissionTimeoutMs = 12000;
const publicApiMessages = new Set([
  'A valid email address is required.',
  'Submission details are required.',
  'Too many submissions. Please try again later.'
]);

export async function sendSubmission(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Submission payload is required.');
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), submissionTimeoutMs);
  let response;

  try {
    response = await fetch(`${apiBaseUrl}/api/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        ...payload,
        source: window.location?.pathname || '/'
      })
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Submission timed out. Please try again.');
    }

    throw new Error('Submission could not reach the server.');
  } finally {
    window.clearTimeout(timeout);
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.ok) {
    throw new Error(publicApiMessages.has(result.message) ? result.message : 'Submission failed. Please try again.');
  }

  return result;
}
