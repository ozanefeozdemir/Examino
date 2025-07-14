export interface Question {
  id: number;
  text: string;
  options: string[];       // ["A şıkkı", "B şıkkı", ...]
  difficulty: string;
  correctOptionIndex: number; // Örn: 0, 1, 2, 3
}
