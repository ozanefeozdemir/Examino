import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ExamCreateComponent } from './pages/exam-create/exam-create.component';
import { MyExamsComponent } from './pages/my-exams/my-exams.component';
import { ResultsComponent } from './pages/results/results.component';
import { AvailableExamsComponent } from './pages/available-exams/available-exams.component';
import { TakeExamComponent } from './pages/take-exam/take-exam.component';
import { AuthGuard } from './service/guards/auth.guard';
import {  QuestionCreateComponent } from './pages/question-create/question-create.component';
import { ViewExamComponent } from './pages/view-exam/view-exam.component';
import { ResultDetailComponent } from './pages/result-detail/result-detail.component';
import { AssignExamComponent } from './pages/assign-exam/assign-exam.component';
import { QuestionPoolComponent } from './pages/question-pool/question-pool.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: 'exam-create', component: ExamCreateComponent, canActivate: [AuthGuard]},
    {path: 'my-exams', component: MyExamsComponent, canActivate: [AuthGuard]},
    {path: 'results', component: ResultsComponent, canActivate: [AuthGuard]},
    {path: 'available-exams', component: AvailableExamsComponent, canActivate: [AuthGuard]},
    {path: 'take-exam/:id', component: TakeExamComponent, canActivate: [AuthGuard]},
    {path: 'view-exam/:id', component: ViewExamComponent, canActivate: [AuthGuard]},
    {path: 'result-detail/:resultId/:studentId', component: ResultDetailComponent, canActivate: [AuthGuard]},
    {path: 'question-create', component: QuestionCreateComponent, canActivate: [AuthGuard]},
    {path: 'question-pool', component: QuestionPoolComponent, canActivate: [AuthGuard]},
    {path: 'assign-exam', component: AssignExamComponent, canActivate: [AuthGuard]}
  ];
export const appConfig = [
,
  provideRouter(routes)
];
