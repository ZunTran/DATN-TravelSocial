import { IsArray, IsUUID } from 'class-validator';

export class GetProfilesByIdsBody {
  @IsArray()
  @IsUUID('4', { each: true })
  profileIds!: string[];
}