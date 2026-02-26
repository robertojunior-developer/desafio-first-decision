import { Routes } from '@angular/router';
import { UsersListComponent } from './users/users-list.component';
import { RegisterFormComponent } from './users/register-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersListComponent },
  { path: 'users/register', component: RegisterFormComponent },
  { path: 'users/edit/:id', component: RegisterFormComponent },
  { path: '**', redirectTo: 'users' }
];
