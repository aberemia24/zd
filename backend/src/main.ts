// [LECȚIE] Pentru orice operațiune pe date multi-user, asigură-te că există filtrare pe user_id atât la nivel de API cât și la nivel de politici RLS (defense in depth).
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as net from 'net';

/**
 * Găsește primul port disponibil începând cu portul specificat
 * Similar cu comportamentul Vite pentru frontend
 */
async function findAvailablePort(startPort: number = 3001): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = (server.address() as net.AddressInfo)?.port;
      server.close(() => {
        resolve(port);
      });
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Port ocupat, încearcă următorul
        console.log(`Port ${startPort} is in use, trying another one...`);
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
  const port = envPort || await findAvailablePort(3001);
  
  await app.listen(port);
  console.log(`🚀 Backend server is running on: http://localhost:${port}`);
  console.log(`📡 API endpoints available at: http://localhost:${port}/api`);
  
  if (envPort) {
    console.log(`🔧 Using PORT from environment: ${port}`);
  } else {
    console.log(`🔍 Auto-discovered available port: ${port}`);
  }
}

bootstrap().catch(error => {
  console.error('❌ Failed to start backend server:', error);
  process.exit(1);
});
