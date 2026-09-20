import DOMPurify from 'isomorphic-dompurify';

export function sanitize(input: string | null | undefined): string {
  if (!input) return '';

  let clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  clean = clean.replace(/['";\\]/g, '');

  return clean.trim();
}

export function sanitizePromptField(input: string | null | undefined): string {
  if (!input) return '';

  let clean = sanitize(input);

  const dangerous = [
    'ignore previous',
    'ignore above',
    'disregard',
    'forget your instructions',
    'system prompt',
    'you are now',
    'new instructions',
    'override',
    'jailbreak'
  ];

  for (const term of dangerous) {
    clean = clean.replace(new RegExp(term, 'gi'), '');
  }

  return clean.slice(0, 500);
}