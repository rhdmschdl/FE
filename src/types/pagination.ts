export type DefaultPaginationRequest = {
  page?: number;
  size?: number;
};

export type DefaultPaginationResponse = {
  size: number;
  pageNumber: number;
  totalElements: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  empty: boolean;
};
