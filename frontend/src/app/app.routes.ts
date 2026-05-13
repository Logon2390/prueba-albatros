import { Routes } from '@angular/router';
import { PostsPage } from '@features/posts/pages/posts/posts';
import { Details } from '@features/posts/pages/details/details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  },
  {
    path: 'posts',
    component: PostsPage
  },
  {
    path: 'post/:id',
    component: Details
  }
];
