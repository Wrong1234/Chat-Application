import { Types } from 'mongoose';

/* ---------------- Address ---------------- */
export interface IAddress {
  country?: string;
  cityState?: string;
  roadArea?: string;
  postalCode?: string;
  taxId?: string;
}

/* ---------------- User Document ---------------- */
export interface IUser {
  fullName: string;
  email: string;
  password: string;

  username?: string;
  phone?: string;

  dob?: Date | null;
  gender?: 'male' | 'female' | 'other';

  role?: 'User' | 'Admin';

  stripeAccountId?: string | null;

  bio?: string;
  address?: IAddress;

  profileImage?: string;
  multiProfileImage?: string[];
  pdfFile?: string;

  about?: string;

  isOnline?: boolean;
  lastSeen?: Date;

  contacts?: Types.ObjectId[];
  blockedUsers?: Types.ObjectId[];

  otp?: string | null;
  otpExpires?: Date | null;
  otpVerified?: boolean;

  resetExpires?: Date | null;

  isVerified?: boolean;

  refreshToken?: string;

  hasActiveSubscription?: boolean;
  subscriptionExpireDate?: Date | null;

  language?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

/* ---------------- Instance Methods ---------------- */
export interface IUserMethods {
  comparePassword(plainPassword: string): Promise<boolean>;
  generateAccessToken(payload: Record<string, any>): string;
  generateRefreshToken(payload: Record<string, any>): string;
}

/* ---------------- User Model Type ---------------- */
export type UserModelType = IUser & IUserMethods;
