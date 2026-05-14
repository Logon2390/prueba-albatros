import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
  computed,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { noWhitespace } from '@app/shared/validators/no-whitespace.validator';
import { Modal } from '@app/shared/components/modal/modal';
import { AppInput } from '@app/shared/components/input/input';
import { AppTextArea } from '@app/shared/components/text-area/text-area';
import { Button } from '@app/shared/components/button/button';
import { Post } from '@features/posts/model/post.model';

export interface CreatePost {
  mode: 'create' | 'edit';
  postId?: string;
  title: string;
  body: string;
  author: string;
  close: () => void;
}

@Component({
  selector: 'app-create-post-modal',
  imports: [ReactiveFormsModule, Modal, AppInput, AppTextArea, Button],
  templateUrl: './create-post-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostModal {
  readonly closed = output<void>();
  readonly submitPost = output<CreatePost>();
  readonly isOpen = signal(false);
  readonly mode = signal<'create' | 'edit'>('create');
  readonly editingPostId = signal<string | null>(null);

  readonly modalTitle = computed(() => (this.mode() === 'edit' ? 'Editar post' : 'Crear post'));
  readonly modalDescription = computed(() =>
    this.mode() === 'edit'
      ? 'Actualiza los detalles del post seleccionado.'
      : 'Completa los detalles del nuevo post.',
  );
  readonly submitLabel = computed(() => (this.mode() === 'edit' ? 'Guardar' : 'Crear'));

  readonly noWhitespace: ValidatorFn = noWhitespace;

  readonly form = inject(FormBuilder).group({
    title: ['', [Validators.required, noWhitespace, Validators.minLength(3)]],
    author: ['', [Validators.required, noWhitespace]],
    body: ['', [Validators.required, noWhitespace, Validators.minLength(10)]],
  });

  open(mode: 'create' | 'edit' = 'create', post?: Post): void {
    const storedAuthor = localStorage.getItem('name')?.trim() ?? '';
    this.mode.set(mode);
    this.editingPostId.set(post?.id ?? null);
    if (mode === 'edit' && post) {
      this.form.reset({
        title: post.title ?? '',
        author: storedAuthor || (post.author ?? ''),
        body: post.body ?? '',
      });
    } else {
      this.form.reset({
        title: '',
        author: storedAuthor,
        body: '',
      });
    }
    this.isOpen.set(true);
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.form.reset();
    this.mode.set('create');
    this.editingPostId.set(null);
    this.closed.emit();
  }

  onClose(): void {
    this.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, body, author } = this.form.getRawValue();
    const mode = this.mode();
    const postId = this.editingPostId() ?? undefined;
    const close = () => this.close();
    this.submitPost.emit({
      mode,
      postId,
      title: title ?? '',
      body: body ?? '',
      author: author ?? '',
      close,
    });
  }

  titleError(): string {
    const control = this.form.controls.title;
    if (!(control.touched || control.dirty) || !control.errors) return '';
    if (control.errors['required']) return 'El titulo es requerido.';
    if (control.errors['minlength']) return 'El titulo debe tener al menos 3 caracteres.';
    if (control.errors['whitespace']) return 'El titulo ingresado no es válido.';
    return '';
  }

  authorError(): string {
    const control = this.form.controls.author;
    if (!(control.touched || control.dirty) || !control.errors) return '';
    if (control.errors['required']) return 'El autor es requerido.';
    if (control.errors['whitespace']) return 'El autor ingresado no es válido.';
    return '';
  }

  bodyError(): string {
    const control = this.form.controls.body;
    if (!(control.touched || control.dirty) || !control.errors) return '';
    if (control.errors['required']) return 'El texto es requerido.';
    if (control.errors['minlength']) return 'El texto debe tener al menos 10 caracteres.';
    if (control.errors['whitespace']) return 'El texto ingresado no es válido.';
    return '';
  }
}
