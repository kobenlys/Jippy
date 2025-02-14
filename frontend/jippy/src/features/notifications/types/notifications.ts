interface NoticeRequest {
  page: number;
  pageSize: number;
  sortBy: string;
  direction: 'ASC' | 'DESC';
  author: string;
  startDate: string;
  endDate: string;
}

export interface Notice {
  noticeId: number;
  storeId: number;
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

export interface NoticeResponse {
  content: Notice[];
  page: number;
  author: string;
  startDate: string;
  endDate: string;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface ApiSuccessResponse {
  code: number;
  success: true;
  data: NoticeResponse;
}

export interface ApiErrorResponse {
  status: string;
  code: string;
  message: string;
  success: false;
  errors: Array<{ reason: string }>;
}