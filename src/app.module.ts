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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    M3UsuariosSeguridadModule,
  ],
})
export class AppModule {}
