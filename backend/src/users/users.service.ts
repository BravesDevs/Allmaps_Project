import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '../generated/prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput | any): Promise<User> {
        return await this.prisma.user.create({
            data,
        });
    }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}
