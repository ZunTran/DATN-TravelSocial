import { Mutation, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { AdminResponseObject } from './objects/admin-response.object';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => AdminResponseObject)
  async seedDefaultAdmin() {
    return this.adminService.seedDefaultAdmin();
  }
}