import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { SemanticSearchDto } from './dto/semantic-search.dto';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('semantic')
  @Roles(Role.Importer)
  async semanticSearch(@Body() payload: SemanticSearchDto) {
    return this.searchService.semanticSearch(payload);
  }
}
