import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get authSecret(): string {
    return process.env.AUTH_SECRET ?? 'dev-auth-secret';
  }

  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN ?? '7d';
  }

  get databaseUrl(): string {
    return (
      process.env.DATABASE_URL ??
      'postgresql://postgres:1234@localhost:5432/my-shop'
    );
  }

  get dbHost(): string {
    return process.env.DB_HOST ?? 'localhost';
  }

  get dbPort(): number {
    return parseInt(process.env.DB_PORT ?? '5432', 10);
  }

  get dbUser(): string {
    return process.env.DB_USER ?? 'postgres';
  }

  get dbPassword(): string {
    return process.env.DB_PASSWORD ?? '1234';
  }

  get dbName(): string {
    return process.env.DB_NAME ?? 'my-shop';
  }

  get port(): number {
    return parseInt(process.env.PORT ?? '3001', 10);
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV ?? 'development';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
