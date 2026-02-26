import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserRequest, UserResponse, UserService } from './user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

function matchFields(field: string, confirmField: string) {
  return (group: any) => {
    const f = group.get(field);
    const c = group.get(confirmField);
    if (!f || !c) return null;
    return f.value === c.value ? null : { fieldsMismatch: true };
  };
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
  <mat-card>
    <h2>{{ editing ? 'Editar Usuário' : 'Cadastro de Usuário' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="w100">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="name" required>
        <mat-error *ngIf="form.get('name')?.hasError('required')">Nome é obrigatório</mat-error>
        <mat-error *ngIf="form.get('name')?.hasError('minlength')">Mínimo 3 caracteres</mat-error>
        <mat-error *ngIf="form.get('name')?.hasError('maxlength')">Máximo 50 caracteres</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w100">
        <mat-label>E-mail</mat-label>
        <input matInput formControlName="email" required>
        <mat-error *ngIf="form.get('email')?.hasError('required')">E-mail é obrigatório</mat-error>
        <mat-error *ngIf="form.get('email')?.hasError('email')">E-mail inválido</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w100">
        <mat-label>Senha</mat-label>
        <input matInput formControlName="password" required type="password">
        <mat-error *ngIf="form.get('password')?.hasError('required')">Senha é obrigatória</mat-error>
        <mat-error *ngIf="form.get('password')?.hasError('minlength')">Mínimo 6 caracteres</mat-error>
        <mat-error *ngIf="form.get('password')?.hasError('maxlength')">Máximo 20 caracteres</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w100">
        <mat-label>Confirme a Senha</mat-label>
        <input matInput formControlName="confirmPassword" required type="password">
        <mat-error *ngIf="form.get('confirmPassword')?.hasError('required')">Confirmação é obrigatória</mat-error>
        <mat-error *ngIf="form.hasError('fieldsMismatch')">Senhas não conferem</mat-error>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || form.pending">
        {{ editing ? 'Salvar' : 'Cadastrar' }}
      </button>
    </form>
  </mat-card>
  `,
  styles: [`.w100{width:100%;display:block}`]
})
export class RegisterFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: matchFields('password', 'confirmPassword') });

  editing = false;
  editingId: string | null = null;

  constructor() {
    this.route.paramMap.subscribe(p => {
      const id = p.get('id');
      this.editing = !!id;
      this.editingId = id;
      if (this.editing && this.editingId) {
        this.service.get(this.editingId).subscribe((u: UserResponse) => {
          this.form.patchValue({
            name: u.name,
            email: u.email,
            password: '',
            confirmPassword: ''
          });
        });
      } else {
        this.form.reset({ name: '', email: '', password: '', confirmPassword: '' });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const payload: UserRequest = this.form.value as any;
    const req$ = this.editing && this.editingId
      ? this.service.update(this.editingId, payload)
      : this.service.create(payload);

    req$.subscribe({
      next: (_res: UserResponse) => {
        this.snack.open(this.editing ? 'Usuário atualizado com sucesso' : 'Usuário cadastrado com sucesso', 'OK', { duration: 3000 });
        this.router.navigate(['/users']);
      },
    });
  }
}
