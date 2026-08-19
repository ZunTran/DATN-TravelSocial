import { registerEnumType } from '@nestjs/graphql';

import {
  MediaType,
  PostPrivacy,
  PostReportStatus,
  PostStatus,
} from '@prisma/client';

registerEnumType(PostPrivacy, {
  name: 'PostPrivacy',
});

registerEnumType(PostStatus, {
  name: 'PostStatus',
});

registerEnumType(MediaType, {
  name: 'MediaType',
});

registerEnumType(PostReportStatus, {
  name: 'PostReportStatus',
});