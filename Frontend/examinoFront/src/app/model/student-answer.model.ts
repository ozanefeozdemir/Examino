import { User } from './user.model';
import { Question } from './question.model';
import { Exam } from './exam.model';

export interface StudentAnswer {
  id: number;
  answerText: string;
  student: User;
  question: Question;
  exam: Exam;
}
