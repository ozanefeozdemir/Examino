import { User } from './user.model';
import { Exam } from './exam.model';

export interface Result {
  id: number;
  student: User;
  exam: Exam;
  solveDate: Date
  correctAnswers: number;
  totalQuestions: number;
  score: number;
}
