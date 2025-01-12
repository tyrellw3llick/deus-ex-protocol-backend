export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const createSuccessResponse = <T>(data: T): ApiSuccessResponse<T> => ({
  success: true,
  data,
});

export const createErrorResponse = (code: string, message: string): ApiErrorResponse => ({
  success: false,
  error: {
    code,
    message,
  },
});
