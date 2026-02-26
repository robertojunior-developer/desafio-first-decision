import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from './shared/loading.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatProgressBarModule, NgIf, AsyncPipe],
  template: `
    <mat-toolbar color="primary">
      <span>Cadastro de Usuários</span>
      <span class="spacer"></span>
      <button mat-raised-button color="accent" routerLink="/users">Listagem</button>
      <button mat-raised-button color="accent" style="margin-left:8px;" routerLink="/users/register">Cadastrar</button>
    </mat-toolbar>
    <mat-progress-bar *ngIf="loading$ | async" mode="indeterminate" color="accent"></mat-progress-bar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `.spacer{flex:1 1 auto}`,
    `.container{padding:16px;}`
  ]
})
export class AppComponent {
  private loader = inject(LoadingService);
  loading$ = this.loader.asObservable();
}
