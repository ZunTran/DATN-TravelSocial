import { InputType } from '@nestjs/graphql';
import { PaginationInput } from '../../../common/dto/pagination.input';

@InputType()
export class GetUserInterestsInput extends PaginationInput {
}