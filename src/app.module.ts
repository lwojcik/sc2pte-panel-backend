import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { StatusModule } from './status/status.module';
import { MainModule } from './main/main.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard, PassthroughGuard } from './auth/guards';
import { configValidationSchema } from './config/config-validation.schema';
import { throttleConfig } from './config';
import { ViewerModule } from './viewer/viewer.module';
import { UserConfigModule } from './userconfig/userconfig.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(throttleConfig)],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('throttle.ttlSecs'),
        limit: config.get('throttle.limit'),
      }),
    }),
    AuthModule,
    MainModule,
    StatusModule,
    UserConfigModule,
    ViewerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass:
        // istanbul ignore next
        process.env.SAS_AUTH_ENABLE === 'true'
          ? JwtAuthGuard
          : PassthroughGuard,
    },
  ],
})
export class AppModule {}
