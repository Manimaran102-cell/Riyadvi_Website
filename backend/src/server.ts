import { createApp } from './app';
import { connectDB, disconnectDB } from './config/db';
import { env } from './config/env';

async function main() {
  const app = createApp();
  const server = app.listen(env.PORT, () => console.log(`API listening on :${env.PORT} (${env.NODE_ENV})`));

  // Keep serving /api/health even if Mongo is briefly unavailable; retry in background.
  const tryConnect = async (attempt = 1): Promise<void> => {
    try {
      await connectDB();
    } catch (err) {
      console.error(`MongoDB connection failed (attempt ${attempt}):`, (err as Error).message);
      setTimeout(() => void tryConnect(attempt + 1), Math.min(30_000, attempt * 5_000));
    }
  };
  void tryConnect();

  const shutdown = async () => {
    server.close();
    await disconnectDB().catch(() => undefined);
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

void main();
