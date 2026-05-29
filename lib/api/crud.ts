import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './client'

export function createCrudApi<TList, TItem, TCreate = Partial<TItem>, TUpdate = Partial<TItem>>(basePath: string) {
  return {
    list: (config?: Parameters<typeof apiGet<TList>>[1]) => apiGet<TList>(basePath, config),
    get: (id: string, config?: Parameters<typeof apiGet<TItem>>[1]) => apiGet<TItem>(`${basePath}/${id}`, config),
    create: (body: TCreate, config?: Parameters<typeof apiPost<TItem, TCreate>>[2]) => apiPost<TItem, TCreate>(basePath, body, config),
    update: (id: string, body: TUpdate, config?: Parameters<typeof apiPut<TItem, TUpdate>>[2]) => apiPut<TItem, TUpdate>(`${basePath}/${id}`, body, config),
    patch: (id: string, body: Partial<TUpdate>, config?: Parameters<typeof apiPatch<TItem, Partial<TUpdate>>>[2]) => apiPatch<TItem, Partial<TUpdate>>(`${basePath}/${id}`, body, config),
    remove: (id: string, config?: Parameters<typeof apiDelete<TItem>>[1]) => apiDelete<TItem>(`${basePath}/${id}`, config),
  }
}

export function createSingleResourceApi<TRead, TWrite = Partial<TRead>>(basePath: string) {
  return {
    read: (config?: Parameters<typeof apiGet<TRead>>[1]) => apiGet<TRead>(basePath, config),
    write: (body: TWrite, config?: Parameters<typeof apiPost<TRead, TWrite>>[2]) => apiPost<TRead, TWrite>(basePath, body, config),
    update: (body: TWrite, config?: Parameters<typeof apiPut<TRead, TWrite>>[2]) => apiPut<TRead, TWrite>(basePath, body, config),
    patch: (body: Partial<TWrite>, config?: Parameters<typeof apiPatch<TRead, Partial<TWrite>>>[2]) => apiPatch<TRead, Partial<TWrite>>(basePath, body, config),
    remove: (config?: Parameters<typeof apiDelete<TRead>>[1]) => apiDelete<TRead>(basePath, config),
  }
}
