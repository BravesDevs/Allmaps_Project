import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'Return the JWT access token.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    async signup(@Body() body: SignupDto) {
        // Check if user exists (handled by database unique constraint usually, or check here)
        // For now rely on service/prisma error or simple flow
        return this.authService.register(body.email, body.password);
    }
}
