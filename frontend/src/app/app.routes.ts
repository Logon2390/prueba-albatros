import { Routes } from '@angular/router';
import { PostsPage } from '@features/posts/pages/posts/posts';
import { Details } from '@features/posts/pages/details/details';
import { HomePage } from '@features/home/pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'post',
    redirectTo: 'posts',
    pathMatch: 'full',
  },
  {
    path: 'posts',
    component: PostsPage,
  },
  {
    path: 'post/:id',
    component: Details,
  },
];
