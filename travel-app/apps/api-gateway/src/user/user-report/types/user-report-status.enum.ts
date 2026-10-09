import { registerEnumType } from '@nestjs/graphql';

export enum UserReportStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

registerEnumType(UserReportStatus, {
  name: 'UserReportStatus',
});