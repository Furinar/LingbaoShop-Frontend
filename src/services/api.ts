import type { ApiResponse, PaginatedResponse, ListResponse, SortType } from '@/types/sharecode'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  let response: Response
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    })
  } catch {
    throw new Error('网络连接失败，请检查网络或稍后重试')
  }

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status} ${response.statusText}`)
  }

  // 检查响应是否为JSON 防止返回HTML页面
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('服务端未响应，请确认后端服务已启动')
  }

  return response.json() as Promise<T>
}

export function fetchShareCodesPage(params: {
  page?: number
  pageSize?: number
  sort?: SortType
}): Promise<PaginatedResponse> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.pageSize) query.set('pageSize', String(params.pageSize))
  if (params.sort) query.set('sort', params.sort)

  const qs = query.toString()
  return request<PaginatedResponse>(`/sharecode/page${qs ? `?${qs}` : ''}`)
}

export function fetchShareCodes(params?: {
  sort?: SortType
  limit?: number
}): Promise<ListResponse> {
  const query = new URLSearchParams()
  if (params?.sort) query.set('sort', params.sort)
  if (params?.limit) query.set('limit', String(params.limit))

  const qs = query.toString()
  return request<ListResponse>(`/sharecode${qs ? `?${qs}` : ''}`)
}

export function useShareCode(code: string): Promise<{ code: number; msg: string; data: unknown }> {
  return request(`/sharecode/${encodeURIComponent(code)}/use`, {
    method: 'POST',
  })
}

export function createShareCode(params: {
  code: string
  price: number
}): Promise<ApiResponse> {
  return request<ApiResponse>('/sharecode', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
