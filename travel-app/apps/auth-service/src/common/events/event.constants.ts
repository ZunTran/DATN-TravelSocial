export const RABBITMQ_SERVICE = 'RABBITMQ_SERVICE';
export const USER_REGISTERED_EVENT = 'user.registered';

export interface UserRegisteredEvent {
  accountId: string;
  email: string;
}