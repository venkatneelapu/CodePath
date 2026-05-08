import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id);
}

export function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const responseHandler = {
  success: (data: any, message = 'Success', statusCode = 200) => ({
    statusCode,
    body: { success: true, message, data },
  }),

  error: (error: Error | ApiError, statusCode = 500) => {
    if (error instanceof ApiError) {
      return {
        statusCode: error.statusCode,
        body: {
          success: false,
          message: error.message,
          errors: error.errors,
        },
      };
    }
    return {
      statusCode,
      body: {
        success: false,
        message: error.message || 'Internal Server Error',
      },
    };
  },
};

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REQUIREMENTS =
  'Password must be at least 8 characters with uppercase, lowercase, and numbers';

