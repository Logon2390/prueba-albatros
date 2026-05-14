import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map, retry } from 'rxjs/operators';
import { Comment } from '../model/comment.model';
import { ApiResponse} from '@app/shared/model/api-response.model';

const BASE_URL = 'http://localhost:3000/comments';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private readonly http: HttpClient) {}

  create(payload: Partial<Comment>): Observable<Comment> {
    return this.http.post<ApiResponse<Comment>>(BASE_URL, payload).pipe(
      retry(2),
      map((response) => response.data as Comment),
    );
  }

  findByPostId(postId: string): Observable<Comment[]> {
    const params = new HttpParams().set('postId', postId);
    return this.http.get<ApiResponse<Comment[]>>(BASE_URL, { params }).pipe(
      delay(500),
      retry(2),
      map((response) => response.data ?? []),
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${BASE_URL}/${id}`).pipe(
      retry(2),
      map((response) => response.data as void),
    );
  }
}
