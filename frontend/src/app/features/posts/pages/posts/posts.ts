import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';

import {
  catchError,
  combineLatest,
  finalize,
  map,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PostService } from '@app/features/posts/services/post.service';
import { Post } from '@features/posts/model/post.model';
import { PaginatedResponse } from '@app/shared/model/api-response.model';

//componentes
import { Button } from '@app/shared/components/button/button';
import { AppInput } from '@app/shared/components/input/input';
import { Modal } from '@app/shared/components/modal/modal';
import { EmptyState } from '@app/shared/components/empty-state/empty-state';
import { Loader } from '@app/shared/components/loader/loader';
import { PostItem } from '@app/features/posts/components/post/post';
import { Pagination } from '@shared/components/pagination/pagination';

const EMPTY_RESPONSE: PaginatedResponse<Post> = {
  data: [],
  meta: {
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

@Component({
  selector: 'app-posts',
  imports: [
    CommonModule,
    RouterModule,
    PostItem,
    Pagination,
    Button,
    AppInput,
    Modal,
    EmptyState,
    Loader,
  ],
  templateUrl: './posts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsPage implements OnDestroy {
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);

  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(6);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly search = signal<string>('');

  private readonly refresh$ = new Subject<void>();
  private readonly query = computed(() => ({
    page: this.currentPage(),
    limit: this.itemsPerPage(),
  }));

  private readonly response = toSignal(
    combineLatest([toObservable(this.query), this.refresh$.pipe(startWith(null))]).pipe(
      map(([query]) => query),
      tap(() => {
        this.isLoading.set(true);
        this.errorMessage.set(null);
      }),
      switchMap((query) =>
        this.postService.findAll(query).pipe(
          catchError(() => {
            this.errorMessage.set('No se pudieron cargar los posts.');
            return of(EMPTY_RESPONSE);
          }),
          finalize(() => this.isLoading.set(false)),
        ),
      ),
    ),
    { initialValue: EMPTY_RESPONSE },
  );

  readonly posts = computed(() => this.response().data ?? []);
  readonly filteredPosts = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.posts();
    return this.posts().filter((post) => post.title.toLowerCase().includes(term));
  });

  readonly totalItems = computed(() => {
    const term = this.search().trim();
    return term ? this.filteredPosts().length : (this.response().meta?.total ?? 0);
  });

  readonly totalPages = computed(() => {
    const term = this.search().trim();
    return term ? 1 : (this.response().meta?.totalPages ?? 1);
  });

  readonly deleteModalOpen = signal(false);
  readonly selectedPostId = signal<string | null>(null);

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onSearchChange(value: string): void {
    this.search.set(value);
  }

  onViewPost(id: string): void {
    this.router.navigate(['/post', id]);
  }

  onEditPost(id: string): void {
    this.router.navigate(['/posts', id, 'edit']);
  }

  onDeletePost(id: string): void {
    this.selectedPostId.set(id);
    this.deleteModalOpen.set(true);
  }

  onConfirmDelete(): void {
    const postId = this.selectedPostId();
    if (!postId) return;

    this.postService.remove(postId).subscribe({
      next: () => {
        this.onReload();
        this.onCloseModal();
      },
      error: () => {
        alert('No se pudo eliminar el post. Por favor, intenta de nuevo.');
        this.onCloseModal();
      },
    });
  }

  onCreatePost(): void {
    this.router.navigate(['/posts/new']);
  }

  onCloseModal(): void {
    this.deleteModalOpen.set(false);
    this.selectedPostId.set(null);
  }

  onReload(): void {
    this.refresh$.next();
  }

  ngOnDestroy(): void {
    this.refresh$.complete();
  }
}
