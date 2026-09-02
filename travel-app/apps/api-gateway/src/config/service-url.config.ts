export const SERVICE_URLS = {
  AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/graphql',
  USER: process.env.USER_SERVICE_URL || 'http://localhost:3002/graphql',
  SOCIAL: process.env.SOCIAL_SERVICE_URL || 'http://localhost:3003/graphql',
  AI: process.env.AI_SERVICE_URL || 'http://localhost:3004/graphql',
};