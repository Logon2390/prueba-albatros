import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Button } from '@app/shared/components/button/button';
import { formatDate } from '@app/core/utils/format.utils';
import { User } from '@app/shared/components/user/user';

@Component({
  selector: 'app-comment',
  imports: [Button, User],
  templateUrl: './comment.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class Comment {
  id = input.required<string>();
  name = input.required<string>();
  email = input.required<string>();
  time = input.required<string>();
  body = input.required<string>();
  showDelete = input(true);
  delete = output<string>();

  openDeleteModal = output<string>();
  timeAgo = computed(() => formatDate(this.time()));

  onDelete(): void {
    this.delete.emit(this.id());
  }
}
