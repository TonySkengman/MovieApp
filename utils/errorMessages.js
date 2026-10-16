export function getUserFriendlyError(error, fallback) {
  const message = error?.message || '';

  if (
    /network request failed|failed to fetch|network error|fetch failed|timeout/i.test(
      message
    )
  ) {
    return 'Unable to connect. Please check your internet connection and try again.';
  }

  return message || fallback;
}