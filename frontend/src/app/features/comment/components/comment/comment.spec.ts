import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comment } from './comment';

describe('Comment', () => {
  let component: Comment;
  let fixture: ComponentFixture<Comment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comment],
    }).compileComponents();

    fixture = TestBed.createComponent(Comment);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'c1');
    fixture.componentRef.setInput('userName', 'Test User');
    fixture.componentRef.setInput('email', 'test@example.com');
    fixture.componentRef.setInput('time', 'Ahora');
    fixture.componentRef.setInput('body', 'Comentario de prueba');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
