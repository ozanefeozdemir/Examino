export interface User {
  id: number |any;
  fullName: string;
  email: string;
  password?: string;
  role: 'STUDENT' | 'TEACHER';
}
