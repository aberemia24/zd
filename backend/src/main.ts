// [LECȚIE] Pentru orice operațiune pe date multi-user, asigură-te că există filtrare pe user_id atât la nivel de API cât și la nivel de politici RLS (defense in depth).
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'net';
import { createServer } from 'net';
import process from 'process';
import { AppModule } from './app.module.js';

/**
 * Găsește primul port disponibil începând cu portul specificat
 * Similar cu comportamentul Vite pentru frontend
 */
async function findAvailablePort(startPort: number = 3001): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.listen(startPort, () => {
      const port = (server.address() as AddressInfo)?.port;
      server.close(() => {
        resolve(port);
      });
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Port ocupat, încearcă următorul (silent, ca Vite)
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ PRIORITATE: ENV PORT > AUTO DISCOVERY > DEFAULT 3001
  const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : null;
  const defaultPort = 3001;
  const port = envPort || await findAvailablePort(defaultPort);

  await app.listen(port);

  // 🎯 Mesaje similare cu Vite
  console.log(`🚀 Backend ready at http://localhost:${port}`);
  console.log(`📡 API available at http://localhost:${port}/api`);

  if (envPort) {
    console.log(`🔧 Using PORT=${port} from environment`);
  } else if (port !== defaultPort) {
    console.log(`ℹ️  Port ${defaultPort} was busy, using ${port} instead`);
  }
}

bootstrap().catch(error => {
  console.error('❌ Failed to start backend server:', error);
  process.exit(1);
});
