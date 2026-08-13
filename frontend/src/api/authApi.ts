import client from './client';
import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  ForgotPasswordPayload,
  ResendUserIdPayload,
  ResetPasswordPayload,
} from '../types';

export const authApi = {
  register: (data: RegisterPayload) =>
    client.post<RegisterResponse>('/auth/register', data),

  login: (data: LoginPayload) =>
    client.post<LoginResponse>('/auth/login', data),

  verifyEmail: (token: string, newEmail?: string) =>
    client.get<{ success: boolean; message: string }>('/auth/verify-email', {
      params: { token, new_email: newEmail },
    }),

  resendUserId: (email: string) =>
    client.post<{ message: string }>('/auth/resend-user-id', { email }),

  forgotPassword: (data: ForgotPasswordPayload) =>
    client.post<{ message: string }>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordPayload) =>
    client.post<{ message: string }>('/auth/reset-password', data),
};