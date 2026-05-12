export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public data?: T,
    public message?: string,
    public status?: number,
  ) {}

  static success<T>(data?: T, message: string = 'OK'): ApiResponse<T> {
    return new ApiResponse<T>(true, data, message);
  }

  static error(
    message: string = 'Operation failed',
    status: number = 400,
  ): ApiResponse<never> {
    return new ApiResponse<never>(false, undefined, message, status);
  }
}
