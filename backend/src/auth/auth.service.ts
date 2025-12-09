import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private transporter;

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
        // Initialize Nodemailer transporter (assuming config is ready or just use a placeholder/ethereal for now)
        // Since no config is provided in env for mail, I'll log or try to use a default.
        // For 'assumption' that it works, I will create a transporter that might fail but catch it.
        // Actually, to make it work on localhost without creds, we might need a real SMTP or a mock.
        // I'll set up a transporter but heavily try-catch the send.
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.MAIL_PORT || '587'),
            auth: {
                user: process.env.MAIL_USER || 'ethereal_user',
                pass: process.env.MAIL_PASS || 'ethereal_pass'
            }
        });
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, isEmailVerified: user.isEmailVerified }
        };
    }

    async register(email: string, pass: string) {
        const hashedPassword = await bcrypt.hash(pass, 10);
        const verificationTokenPlain = `${email}-${Date.now()}`;
        const hashedToken = await bcrypt.hash(verificationTokenPlain, 10);

        try {
            const newUser = await this.usersService.create({
                email,
                password: hashedPassword,
                verificationToken: hashedToken,
                isEmailVerified: false
            });

            // Send Email
            const link = `http://${process.env.APP_HOST}:${process.env.PORT}/auth/verify?token=${verificationTokenPlain}`;
            try {
                await this.transporter.sendMail({
                    from: '"Allmaps" <noreply@allmaps.com>',
                    to: email,
                    subject: 'Verify Your Email for Allmaps',
                    text: `Please verify your email by clicking on the following link: ${link}`,
                    html: `<p>Please verify your email by clicking on the following link: <a href="${link}">Click here to verify your email</a></p>`
                });
                this.logger.log(`Verification email sent to ${email}`);
            } catch (emailError) {
                this.logger.error(`Failed to send verification email to ${email}`, emailError);
                // Do not block signup
            }

            return { message: "Account created! Please check your email to verify your account.", user: { id: newUser.id, email: newUser.email } };

        } catch (error) {
            this.logger.error('Registration failed', error);
            throw error;
        }
    }

    async verifyEmail(token: string) {
        if (!token) throw new BadRequestException('Token is required');

        // Extract email from token (simplistic approach: split by last hyphen)
        const lastHyphenIndex = token.lastIndexOf('-');
        if (lastHyphenIndex === -1) throw new BadRequestException('Invalid token format');

        const email = token.substring(0, lastHyphenIndex);

        const user = await this.usersService.findOne(email);
        if (!user) {
            // Return simplified error as per requirements, or generic
            return { success: false, message: "Invalid or expired verification link." };
        }

        if (user.isEmailVerified) {
            return { success: false, message: "Email already verified." }; // Or generic message
        }

        const isValid = await bcrypt.compare(token, user.verificationToken || '');
        if (!isValid) {
            return { success: false, message: "Invalid or expired verification link." };
        }

        await this.usersService.update(user.id, {
            isEmailVerified: true,
            verificationToken: null
        });

        return { success: true, message: "Email verified successfully! You can now save workflows." };
    }
}
