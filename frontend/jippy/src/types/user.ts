export interface UserProfile {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}