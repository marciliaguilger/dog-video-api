import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/domain/use-cases/auth/auth.service';
import { JwtAuthGuard } from 'src/domain/use-cases/auth/jwt-auth.guard';
import { JwtStrategy } from 'src/domain/use-cases/auth/jwt-strategy.service';

   @Module({
     imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
        secret: 'teste',  // Replace with your secret key
        signOptions: { expiresIn: '60s' }, // Set token expiration time
      }),
       PassportModule,
     ],
     providers: [AuthService, JwtStrategy, JwtAuthGuard],
     exports: [AuthService],
   })
   export class AuthModule {}