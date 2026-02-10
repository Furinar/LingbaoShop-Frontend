import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ShareCode, SortType } from '@/types/sharecode'
import { fetchShareCodesPage, fetchShareCodes, createShareCode } from '@/services/api'

export const useShareCodeStore = defineStore('sharecode', () => {
  const shareCodes = ref<ShareCode[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sortBy = ref<SortType>('time')
  const currentPage = ref(1)
  const pageSize = ref(20)
  const totalItems = ref(0)
  const totalPages = ref(0)
  const hasMore = computed(() => currentPage.value < totalPages.value)

  // 价格排序时，前端缓存全量近3小时数据
  const priceFilteredAll = ref<ShareCode[]>([])

  const total = computed(() => totalItems.value)

  async function loadShareCodes() {
    const isFirstLoad = shareCodes.value.length === 0
    if (isFirstLoad) {
      loading.value = true
    }
    error.value = null
    currentPage.value = 1

    try {
      if (sortBy.value === 'price') {
        await loadPriceSorted()
      } else {
        await loadTimeSorted(1, false)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '网络错误'
    } finally {
      loading.value = false
    }
  }

  // 定时刷新：重新获取已加载的所有页数据，不重置页码
  async function refreshShareCodes() {
    error.value = null
    const pagesToLoad = currentPage.value

    try {
      if (sortBy.value === 'price') {
        await loadPriceSorted()
        // 恢复到之前的页码位置
        const endIndex = pagesToLoad * pageSize.value
        shareCodes.value = priceFilteredAll.value.slice(0, endIndex)
        currentPage.value = pagesToLoad
      } else {
        // 一次性获取 1~currentPage 的所有数据
        const res = await fetchShareCodesPage({
          page: 1,
          pageSize: pageSize.value * pagesToLoad,
          sort: 'time',
        })
        if (res.code === 200 || res.code === 0) {
          shareCodes.value = res.data.data || []
          totalItems.value = res.data.total
          totalPages.value = Math.ceil(totalItems.value / pageSize.value)
          currentPage.value = pagesToLoad
        } else {
          error.value = res.msg || '加载失败'
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '网络错误'
    }
  }

  async function loadTimeSorted(page: number, append: boolean) {
    const res = await fetchShareCodesPage({
      page,
      pageSize: pageSize.value,
      sort: 'time',
    })
    if (res.code === 200 || res.code === 0) {
      if (append) {
        shareCodes.value.push(...(res.data.data || []))
      } else {
        shareCodes.value = res.data.data || []
      }
      totalItems.value = res.data.total
      totalPages.value = res.data.totalPages
      currentPage.value = res.data.page
    } else {
      error.value = res.msg || '加载失败'
    }
  }

  async function loadPriceSorted() {
    const res = await fetchShareCodes({ sort: 'price', limit: 10000 })
    if (res.code === 200 || res.code === 0) {
      const threeHoursAgo = Math.floor(Date.now() / 1000) - 3 * 3600
      priceFilteredAll.value = (res.data || [])
        .filter((item: ShareCode) => item.create_time >= threeHoursAgo)
        .sort((a: ShareCode, b: ShareCode) => b.price - a.price)
      totalItems.value = priceFilteredAll.value.length
      totalPages.value = Math.ceil(totalItems.value / pageSize.value)
      currentPage.value = 1
      shareCodes.value = priceFilteredAll.value.slice(0, pageSize.value)
    } else {
      error.value = res.msg || '加载失败'
    }
  }

  async function loadMore() {
    if (!hasMore.value || loading.value) return

    loading.value = true
    error.value = null

    try {
      if (sortBy.value === 'price') {
        const nextPage = currentPage.value + 1
        const start = (nextPage - 1) * pageSize.value
        const end = start + pageSize.value
        shareCodes.value.push(...priceFilteredAll.value.slice(start, end))
        currentPage.value = nextPage
      } else {
        await loadTimeSorted(currentPage.value + 1, true)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '网络错误'
    } finally {
      loading.value = false
    }
  }

  async function toggleSort() {
    sortBy.value = sortBy.value === 'time' ? 'price' : 'time'
    await loadShareCodes()
  }

  async function setSort(sort: SortType) {
    if (sortBy.value === sort) return
    sortBy.value = sort
    await loadShareCodes()
  }

  async function addShareCode(code: string, price: number): Promise<{ success: boolean; msg: string }> {
    try {
      const res = await createShareCode({ code, price })
      if (res.code === 200 || res.code === 0) {
        await loadShareCodes()
        return { success: true, msg: '分享码添加成功' }
      }
      return { success: false, msg: res.msg || '添加失败' }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '网络错误'
      return { success: false, msg }
    }
  }

  return {
    shareCodes,
    loading,
    error,
    sortBy,
    currentPage,
    totalPages,
    hasMore,
    total,
    loadShareCodes,
    refreshShareCodes,
    loadMore,
    toggleSort,
    setSort,
    addShareCode,
  }
})
