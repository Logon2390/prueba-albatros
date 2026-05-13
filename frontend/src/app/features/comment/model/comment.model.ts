export interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  body: string;
  createdAt: string | Date;
}
