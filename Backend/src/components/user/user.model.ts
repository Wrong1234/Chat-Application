// import RoleType from '../../lib/types.js';
import mongoose, { model, Model, Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { accessTokenExpires, accessTokenSecrete, refreshTokenExpires, refreshTokenSecrete } from '../../config/config';
import { IUser, IUserMethods } from './user.interface';

// import { accessTokenExpires, accessTokenSecrete, refreshTokenExpires, refreshTokenSecrete } from '../../config/config';


const AddressSchema = new mongoose.Schema({
  country: { type: String, default: '' },
  cityState: { type: String, default: '' },
  roadArea: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  taxId: { type: String, default: '' }
}, { _id: false });


const UserSchema = new Schema<IUser, {}, IUserMethods>(
  {
      fullName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      username: { type: String },
      phone: {type: String},
      dob: { type: Date, default: null },
      gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'male'
      },

      role: {
        type: String,
        default: "User",
        enum: ['User', 'Admin'],
      },

      stripeAccountId: { type: String, default: null },

      bio: { type: String, default: '' },
      address: { type: AddressSchema, default: () => ({}) },

      profileImage: { type: String, default: '' },
      multiProfileImage: { type: [String], default: [] },
      pdfFile: { type: String, default: '' },
      about: {
      type: String,
      default: 'Hey there! I am using WhatsApp'
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    lastSeen: {
      type: Date,
      default: Date.now
    },
    contacts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    blockedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],

    otp: {
      type: String,
      default: null
    },

    otpExpires: {
      type: Date,
      default: null
    },

    otpVerified : {
      type: Boolean,
      default: false
    },

    resetExpires : {
      type: Date,
      default: null
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: ''
    },

    hasActiveSubscription: { type: Boolean, default: false },
    subscriptionExpireDate: { type: Date, default: null },
    language: { type: String, default: 'en' }
  },
  { timestamps: true }
);


// Hashing password
UserSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);

  this.password = hashedPassword;
  next();
});

// Password comparison method (bcrypt)
UserSchema.methods.comparePassword = async function (
  plainPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password);
};

// Generate ACCESS_TOKEN
UserSchema.methods.generateAccessToken = function (payload) {
  return jwt.sign(payload, accessTokenSecrete, { expiresIn: accessTokenExpires });
};

// Generate REFRESH_TOKEN
UserSchema.methods.generateRefreshToken = function (payload) {
  return jwt.sign(payload, refreshTokenSecrete, { expiresIn: refreshTokenExpires });
};
type UserModel = Model<IUser, {}, IUserMethods>;

const User = model<IUser, UserModel>('User', UserSchema);

export default User;
