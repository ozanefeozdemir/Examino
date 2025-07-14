import { Question } from './question.model';
import { User } from './user.model';

export interface Exam {
  id: string;
  title: string;
  startTime: string;  // ISO string (LocalDateTime)
  duration: string
  endTime: string;
  teacher: User;
  questions: Question[];
}
