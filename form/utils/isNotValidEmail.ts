export function isNotValidEmail(emailId: string) {
  const REGEX_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (REGEX_PATTERN.test(emailId)) {
    return false;
  }

  return true;
}

export function isNotValidLinkedInUrl(url: string) {
  if (!url) return true;
  // Regular expression to match LinkedIn profile URLs with any username
  const linkedinRegex =
    /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  return !linkedinRegex.test(url);
}
