export interface Category {
  id: string;
  name: string;
}

export interface Board {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  imageUrl: string | null;
}

export interface Page {
  content: Board[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface User {
  username: string;
  name: string;
}
