import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LineLoginDto, UpdateProfileDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('line')
  async signInWithLine(@Body() lineLoginDto: LineLoginDto) {
    try {
      const result = await this.authService.signInWithLine(lineLoginDto);
      return {
        status: 'success',
        message: 'Sign in successful',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Sign in failed',
        error: error,
      };
    }
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Request() req) {
    try {
      const result = await this.authService.refreshToken(req.user.sub);
      return {
        status: 'success',
        message: 'Token refreshed successfully',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Token refresh failed',
        error: error,
      };
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    try {
      const profile = await this.authService.getUserProfile(req.user.sub);
      return {
        status: 'success',
        message: 'Profile retrieved successfully',
        data: profile,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to retrieve profile',
        error: error,
      };
    }
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateData: UpdateProfileDto) {
    try {
      const profile = await this.authService.updateUserProfile(
        req.user.sub,
        updateData,
      );
      return {
        status: 'success',
        message: 'Profile updated successfully',
        data: profile,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to update profile',
        error: error,
      };
    }
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  async signOut(@Request() req) {
    try {
      const result = await this.authService.signOut(req.user.sub);
      return {
        status: 'success',
        message: 'Sign out successful',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Sign out failed',
        error: error,
      };
    }
  }

  @Get('validate/:userId')
  async validateUser(@Param('userId') userId: string) {
    try {
      const profile = await this.authService.validateUser(userId);
      return {
        status: 'success',
        message: 'User validation completed',
        data: {
          valid: !!profile,
          profile: profile,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'User validation failed',
        error: error,
      };
    }
  }
}
