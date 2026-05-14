import { Component, Input } from '@angular/core';
import { InitialsPipe } from '@app/shared/pipes/initials.pipe';

@Component({
  selector: 'app-user',
  imports: [InitialsPipe],
  templateUrl: './user.html',
})
export class User {
   readonly userName: string = localStorage.getItem('name') || 'Anonymous';
}
