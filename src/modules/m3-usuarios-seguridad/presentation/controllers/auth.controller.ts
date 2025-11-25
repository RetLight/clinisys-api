import { Body, Controller, Post } from '@nestjs/common';
import { AuthAppService } from '../../application/services/auth-app.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authAppService: AuthAppService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authAppService.login(dto.email, dto.password);
  }
}
