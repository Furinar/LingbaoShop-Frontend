// 分享码数据模型
export interface ShareCode {
  code: string
  price: number
  create_time: number
  used: number
}

// API通用响应
export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

// 分页数据
export interface PaginationData<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type PaginatedResponse = ApiResponse<PaginationData<ShareCode>>

export type ListResponse = ApiResponse<ShareCode[]>

export type SortType = 'time' | 'price'

export type CardTier = 'normal' | 'new' | 'premium'
