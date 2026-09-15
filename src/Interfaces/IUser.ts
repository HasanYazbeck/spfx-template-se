export interface IUser {
  Id?: number | string | undefined;
  Title?: string | undefined;
  Email?: string | undefined;
  LoginName?: string | undefined;
  IsSiteAdmin?: boolean | undefined;
  IsEmailAuthenticationGuestUser?: boolean | undefined;
  IsHiddenInUI?: boolean | undefined;
  IsShareByEmailGuestUser?: boolean | undefined;
  PrincipalType?: number | undefined;
}
