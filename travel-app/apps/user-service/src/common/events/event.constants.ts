export const USER_REGISTERED_EVENT = 'user.registered';

export interface UserRegisteredEvent {
  accountId: string;
  email: string;
}