import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [RoadmapController],
  providers: [RoadmapService],
})
export class RoadmapModule { }
