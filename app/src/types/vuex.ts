import { Blip, Meta, User, LoginState } from './domain'

export interface BlipsState {
  id: string;
  blips: Blip[];
  isLoading: boolean;
  meta: Meta;
  radarAlias?: string;
  isPublic: boolean;
  ownerId: string;
}

export interface UserState {
  user: User;
  userList: any;
  loginState: LoginState;
}

export interface SettingsState {
  selectedBlipsTitle: string[];
}

export interface CommState {
  snackbar: {
    text: string;
    active: boolean;
  };
}

export interface RootState {
  version: string;
}
