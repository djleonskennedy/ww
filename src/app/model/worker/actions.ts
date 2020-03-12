import {User} from '../users';

export const enum Tags {
  Users = 'Users',
  User = 'User'
}

export interface UsersWorkerAction {
  tag: Tags.Users;
  payload: User[];
}

export interface UserWorkerAction {
  tag: Tags.User;
  payload: User;
}

export type Actions
  = UsersWorkerAction
  | UserWorkerAction;
