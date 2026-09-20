const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 30,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}