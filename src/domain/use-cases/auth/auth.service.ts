import { Injectable } from '@nestjs/common';
   import { JwtService } from '@nestjs/jwt';

   @Injectable()
   export class AuthService {
     constructor(private readonly jwtService: JwtService) {}
  
     async generateJwtToken(user: any): Promise<string> {
       const payload = { username: user.email, sub: user.userId };
       
       return this.jwtService.sign(payload);
     }
   }