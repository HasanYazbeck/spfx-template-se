export interface IUser {
    ID: number | string;
    Title: string;
    Email: string;
    LoginName: string;
    IsSiteAdmin?: boolean;
    IsEmailAuthenticationGuestUser?: boolean;
    IsHiddenInUI?: boolean;
    IsShareByEmailGuestUser?: boolean;
    PrincipalType?: number;
}