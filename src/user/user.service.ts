import { Injectable } from '@nestjs/common';
import { KnexService } from '../knex/knex.service';
import { User } from '../model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly knexService: KnexService) {}

  async createUser(userData: User): Promise<User & { id: number }> {
    const knex = this.knexService.getKnex();
    
    const hashedPassword = await bcrypt.hash(userData.password, 10); 
    const newUserData = { ...userData, password: hashedPassword };

    const [userId] = await knex('users').insert(newUserData);
    return { ...newUserData, id: userId }; 
}
}
