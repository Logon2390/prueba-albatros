import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { PostService } from '@app/features/posts/services/post.service';
import { Post } from '@features/posts/model/post.model';
import { Comment } from '@features/comment/components/comment/comment';
import { Modal } from '@app/shared/components/modal/modal';
import { Button } from '@app/shared/components/button/button';
import { formatDate } from '@app/core/utils/format.utils';
import { Loader } from '@app/shared/components/loader/loader';
import { EmptyState } from '@app/shared/components/empty-state/empty-state';
import { DeletePostModal } from '@app/features/posts/components/delete-post-modal/delete-post-modal';
import {
  CreatePostModal,
  CreatePost,
} from '@features/posts/components/create-post-modal/create-post-modal';
import { AppTextArea } from '@app/shared/components/text-area/text-area';
import { CommentService } from '@app/features/comment/services/comment.services';
import { Comment as CommentModel } from '@app/features/comment/model/comment.model';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
  selector: 'app-details',
  imports: [
    CommonModule,
    RouterModule,
    Comment,
    Modal,
    AppTextArea,
    Button,
    Loader,
    EmptyState,
    DeletePostModal,
    CreatePostModal,
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly commentService = inject(CommentService);
  private readonly notificationService = inject(NotificationService);

  readonly comments = signal<CommentModel[]>([]);
  readonly selectedPostId = signal<string | null>(null);
  readonly selectedCommentId = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isCommentsLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly commentText = signal('');
  readonly deleteCommentModalOpen = signal(false);

  private readonly postState = signal<Post | null>(null);
  readonly post = computed(() => this.postState());
  readonly isModified = computed(() => {
    const post = this.post();
    if (!post) return false;
    const createdAt = new Date(post.createdAt).getTime();
    const updatedAt = new Date(post.updatedAt).getTime();
    return updatedAt - createdAt > 1000;
  });
  readonly formatDate = formatDate;

  constructor() {
    this.loadPost();
  }

  private loadPost(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('No se pudo cargar el post.');
      return;
    }

    this.isLoading.set(true);
    this.isCommentsLoading.set(true);
    this.errorMessage.set(null);
    
    this.postService
      .findOne(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (post) => {
          this.postState.set(post);
        },
        error: () => {
          this.errorMessage.set('No se pudo cargar el post.');
        },
      });

    this.commentService
      .findByPostId(id)
      .pipe(finalize(() => this.isCommentsLoading.set(false)))
      .subscribe({
        next: (comments) => {
          this.comments.set(comments);
        },
        error: () => {
          this.errorMessage.set('No se pudieron cargar los comentarios.');
        },
      });
  }

  onBack(): void {
    this.router.navigate(['/posts']);
  }

  onEdit(modal: CreatePostModal): void {
    const post = this.post();
    if (post) {
      modal.open('edit', post);
    }
  }

  onDelete(): void {
    const id = this.post()?.id;
    if (id) {
      this.postService.remove(id).subscribe({
        next: () => {
          this.notificationService.show('success', 'Post eliminado exitosamente.');
          this.router.navigate(['/posts']);
        },
        error: () => {
          this.notificationService.show('error', 'No se pudo eliminar el post.');
          this.errorMessage.set('No se pudo eliminar el post.');
        },
      });
    }
  }

  onDeletePost(modal: DeletePostModal): void {
    this.selectedPostId.set(this.post()?.id ?? null);
    modal.open();
  }

  onDeleteComment(id: string): void {
    this.comments.update((items) => items.filter((comment) => comment.id !== id));
  }

  onOpenDeleteComment(id: string): void {
    this.selectedCommentId.set(id);
    this.deleteCommentModalOpen.set(true);
  }

  onCloseDeleteCommentModal(): void {
    this.selectedCommentId.set(null);
    this.deleteCommentModalOpen.set(false);
  }

  onConfirmDeleteComment(): void {
    const commentId = this.selectedCommentId();
    if (!commentId) return;

    this.commentService.remove(commentId).subscribe({
      next: () => {
        this.notificationService.show('success', 'Comentario eliminado exitosamente.');
        this.onDeleteComment(commentId);
        this.onCloseDeleteCommentModal();
      },
      error: () => {
        this.errorMessage.set('No se pudo eliminar el comentario.');
        this.notificationService.show('error', 'No se pudo eliminar el comentario.');
      },
    });
  }

  onCloseDeleteModal(): void {
    this.selectedPostId.set(null);
  }

  onConfirmDelete(modal: DeletePostModal): void {
    const id = this.post()?.id;
    if (id) {
      this.onDelete();
      modal.close();
    }
  }

  onSubmitEditPost(payload: CreatePost): void {
    const { close, mode, postId, ...formPayload } = payload;
    if (mode !== 'edit' || !postId) return;

    this.postService.update(postId, formPayload).subscribe({
      next: (updatedPost) => {
        this.notificationService.show('success', 'Post actualizado exitosamente.');
        this.postState.set(updatedPost);
        close();
      },
      error: () => {
        this.errorMessage.set('No se pudo actualizar el post.');
        this.notificationService.show('error', 'No se pudo actualizar el post.');
      },
    });
  }

  onSubmitComment(): void {
    const postId = this.post()?.id;
    if (!postId) return;

    const body = this.commentText().trim();
    if (!body) return;

    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    const name = storedName?.trim() || 'Anonymous';
    const email = storedEmail?.trim() || 'test@gmail.com';

    this.commentService
      .create({
        postId,
        name,
        email,
        body,
      })
      .subscribe({
        next: (newComment) => {
          this.comments.update((items) => [newComment, ...items]);
          this.commentText.set('');
        },
        error: () => {
          this.errorMessage.set('No se pudo publicar el comentario.');
        },
      });
  }
}
