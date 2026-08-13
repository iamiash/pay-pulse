import client from './client';
import { User, UserUpdate, ChangePasswordReq, ChangeEmailReq, VerifyCredentialsReq } from '../types';

export const userApi = {
  getProfile: () => client.get<User>('/users/me'),
  
  updateProfile: (data: UserUpdate) => client.patch<User>('/users/me', data),
  
  changeEmail: (data: ChangeEmailReq) => client.patch<User>('/users/me', {
    email: data.new_email,
    current_password: data.current_password
  }),
  
  changePassword: (data: ChangePasswordReq) => client.post<{ message: string }>('/users/me/change-password', data),
  
  uploadAvatar: (formData: FormData) => client.post<User>('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  deleteAvatar: () => client.delete<User>('/users/me/avatar'),
  
  verifyCredentials: (data: VerifyCredentialsReq) => client.post<{ valid: boolean; message: string }>('/users/me/verify-credentials', data),
  
  deleteAccount: () => client.delete<{ message: string }>('/users/me')
};