import { TestBed } from '@angular/core/testing';
import { RegisterFormComponent } from './register-form.component';
import { provideRouter } from '@angular/router';
import { UserService } from './user.service';
import { of } from 'rxjs';

class UserServiceMock {
  create = jasmine.createSpy('create').and.returnValue(of({} as any));
  update = jasmine.createSpy('update').and.returnValue(of({} as any));
}

describe('RegisterFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useClass: UserServiceMock }
      ]
    }).compileComponents();
  });

  it('deve desabilitar o botão com formulário inválido', () => {
    const fixture = TestBed.createComponent(RegisterFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // Inicialmente vazio -> inválido
    expect(component.form.invalid).toBeTrue();
  });

  it('deve habilitar quando válido e chamar userService.create', () => {
    const fixture = TestBed.createComponent(RegisterFormComponent);
    const component = fixture.componentInstance;
    const service = TestBed.inject(UserService) as unknown as UserServiceMock;

    component.form.setValue({
      name: 'Alice Doe',
      email: 'alice@example.com',
      password: 'secret1',
      confirmPassword: 'secret1'
    });

    expect(component.form.valid).toBeTrue();

    component.onSubmit();
    expect(service.create).toHaveBeenCalled();
  });
});
