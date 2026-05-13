import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Post } from '@features/posts/model/post.model';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
} from '@app/shared/model/api-response.model';

const BASE_URL = 'http://localhost:3000/posts';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private readonly http: HttpClient) {}

  create(payload: Partial<Post>): Observable<Post> {
    return this.http
      .post<ApiResponse<Post>>(BASE_URL, payload)
      .pipe(
        retry(2),
        map((response) => response.data as Post));
  }

  createBulk(payload: Partial<Post>[]): Observable<Post[]> {
    return this.http
      .post<ApiResponse<Post[]>>(`${BASE_URL}/bulk`, payload)
      .pipe(
        retry(2),
        map((response) => response.data ?? []));
  }

  findAll(query?: PaginationQuery): Observable<PaginatedResponse<Post>> {
    let params = new HttpParams();
    if (query?.page) params = params.set('page', query.page);
    if (query?.limit) params = params.set('limit', query.limit);

    return this.http
      .get<ApiResponse<PaginatedResponse<Post>>>(BASE_URL, { params })
      .pipe(
        retry(2),
        map((response) => response.data as PaginatedResponse<Post>));
  }

  findOne(id: string): Observable<Post> {
    return this.http
      .get<ApiResponse<Post>>(`${BASE_URL}/${id}`)
      .pipe(
        retry(2),
        map((response) => response.data as Post));
  }

  update(id: string, payload: Partial<Post>): Observable<Post> {
    return this.http
      .put<ApiResponse<Post>>(`${BASE_URL}/${id}`, payload)
      .pipe(
        retry(2),
        map((response) => response.data as Post));
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${BASE_URL}/${id}`)
      .pipe(
        retry(2),
        map((response) => response.data as void));
  }
}
