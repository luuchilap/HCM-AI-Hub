import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('upload')
export class UploadController {
    @Post('image')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return callback(new BadRequestException('Only image files are allowed!'), false);
                }
                callback(null, true);
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB
            },
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        // Construct the public URL
        // In production, this should be handled by an environment variable for the base URL
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        const filePath = file.path.replace(/\\/g, '/').replace('public/', '');
        return {
            url: `${baseUrl}/${filePath}`,
            filename: file.filename,
        };
    }
}
