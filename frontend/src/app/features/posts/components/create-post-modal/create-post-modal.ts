import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
  computed,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  readonly form = inject(FormBuilder).group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    author: ['', [Validators.required]],
    body: ['', [Validators.required, Validators.minLength(10)]],
  });

  open(mode: 'create' | 'edit' = 'create', post?: Post): void {
    this.mode.set(mode);
    this.editingPostId.set(post?.id ?? null);
    if (mode === 'edit' && post) {
      this.form.reset({
        title: post.title ?? '',
        author: post.author ?? '',
        body: post.body ?? '',
      });
    } else {
      this.form.reset();
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
    if (!control.touched || !control.errors) return '';
    if (control.errors['required']) return 'El titulo es requerido.';
    if (control.errors['minlength']) return 'El titulo debe tener al menos 3 caracteres.';
    return '';
  }

  authorError(): string {
    const control = this.form.controls.author;
    if (!control.touched || !control.errors) return '';
    if (control.errors['required']) return 'El autor es requerido.';
    return '';
  }

  bodyError(): string {
    const control = this.form.controls.body;
    if (!control.touched || !control.errors) return '';
    if (control.errors['required']) return 'El texto es requerido.';
    if (control.errors['minlength']) return 'El texto debe tener al menos 10 caracteres.';
    return '';
  }
}
