import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '@app/shared/components/button/button';
import { Post as PostModel } from '@features/posts/model/post.model';
import { formatDate } from '@app/core/utils/format.utils';
import { User } from '@app/shared/components/user/user';

@Component({
  selector: 'app-post',
  imports: [CommonModule, Button, User],
  templateUrl: './post.html',
})
export class PostItem {
  @Input() post!: PostModel;
  @Input() commentCount: number = 0;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() view = new EventEmitter<string>();

  readonly formatDate = formatDate;

  onEdit(): void {
    this.edit.emit(this.post.id);
  }

  onDelete(): void {
    this.delete.emit(this.post.id);
  }

  onView(): void {
    this.view.emit(this.post.id);
  }
}
