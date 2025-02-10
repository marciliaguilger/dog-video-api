import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/domain/use-cases/auth/auth.service';

   @Module({
     imports: [
       JwtModule.register({
         secret: 'teste',  // Replace with your secret key
         signOptions: { expiresIn: '1h' }, // Set token expiration time
       }),
       PassportModule,
     ],
     providers: [AuthService],
     exports: [AuthService],
   })
   export class AuthModule {}