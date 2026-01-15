import User from '../user/user.model';
import { IUser } from '../user/user.interface';

export const registerUserService = async (
  payload: Partial<IUser>
) => {
  if (!payload.email || !payload.password || !payload.fullName) {
    throw new Error('Required fields missing');
  }

  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new Error('User already registered');
  }

  const user = await User.create(payload);

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImage: user.profileImage,
  };
};

export const loginUserService = async (payload: Partial<IUser>) => {

  if (!payload.email || !payload.password) {
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: payload.email }).select(
    '_id fullName email role profileImage password'
  );

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await user.comparePassword(payload.password);

  if (!isMatch) {
    throw new Error('Invalid password');
  }

  const nextPayload = {
    _id: user._id,
    role: user.role,
  };

  const accessToken = user.generateAccessToken(nextPayload);
  const refreshToken = user.generateRefreshToken(nextPayload);

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  };
};

