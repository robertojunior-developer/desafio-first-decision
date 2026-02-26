import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserResponse, UserService } from './user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatCardModule, MatDialogModule, MatPaginatorModule, MatSortModule],
  template: `
    <mat-card>
      <h2 style="margin:0 0 12px 0;">Usuários Cadastrados</h2>
      <table mat-table [dataSource]="data" matSort class="mat-elevation-z2" style="width:100%">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Nome </th>
          <td mat-cell *matCellDef="let u"> {{u.name}} </td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> E-mail </th>
          <td mat-cell *matCellDef="let u"> {{u.email}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Ações </th>
          <td mat-cell *matCellDef="let u">
            <button mat-stroked-button color="primary" (click)="edit(u.id)">Editar</button>
            <button mat-stroked-button color="warn" style="margin-left:8px;" (click)="remove(u.id)">Deletar</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>
      <mat-paginator [pageSize]="5" [pageSizeOptions]="[5,10,20]"></mat-paginator>
    </mat-card>
  `
})
export class UsersListComponent implements OnInit {
  private service = inject(UserService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  data = new MatTableDataSource<UserResponse>([]);
  cols = ['name','email','actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.service.list().subscribe(res => {
      this.data = new MatTableDataSource<UserResponse>(res);
      if (this.paginator) this.data.paginator = this.paginator;
      if (this.sort) this.data.sort = this.sort;
    });
  }

  edit(id: string) {
    this.router.navigate(['/users/edit', id]);
  }

  remove(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Confirma excluir?', confirmText: 'Excluir', cancelText: 'Cancelar' }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.service.delete(id).subscribe(() => {
        this.snack.open('Usuário excluído com sucesso', 'OK', { duration: 3000 });
        this.reload();
      });
    });
  }
}
