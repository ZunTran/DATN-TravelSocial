import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Global() //Global để các module khác gọi trực tiếp không cần import lại 
@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}