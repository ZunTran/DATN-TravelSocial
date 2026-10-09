import { registerEnumType } from '@nestjs/graphql';
import { user_report_status } from '@prisma/client';

registerEnumType(user_report_status, {
  name: 'UserReportStatus',
});

export { user_report_status };