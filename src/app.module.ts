/*import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
*/
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { M3UsuariosSeguridadModule } from './modules/m3-usuarios-seguridad/m3-usuarios-seguridad.module';
// luego añadirás M1, M2, M4
import { M1HealthModule } from './modules/m1-servicios-salud/m1-health.module';
// (luego añadirás M2, M3, M4)

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    M3UsuariosSeguridadModule,
    M1HealthModule,
  ],
})
export class AppModule {}
