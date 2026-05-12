type Level = "info" | "warn" | "error";

// Minimal structured (JSON-line) logger. Swap the sink for a transport like
// pino in production; the call sites stay the same.
export function log(level: Level, message: string, meta: Record<string, unknown> = {}): void {
  const line = JSON.stringify({ level, time: new Date().toISOString(), message, ...meta });
  if (level === "error") console.error(line);
  else console.log(line);
}
