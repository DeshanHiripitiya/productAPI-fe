import type { CreateProductInput, Product, UpdateProductInput } from '../types/product'

const API_URL = 'http://localhost:5041/api/products'

async function getErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string; title?: string }
    return body.message ?? body.title ?? `Request failed with HTTP ${response.status}`
  } catch {
    return `Request failed with HTTP ${response.status}`
  }
}

export async function getProducts(signal?: AbortSignal) {
  const response = await fetch(API_URL, { signal })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return (await response.json()) as Product[]
}

export async function createProduct(product: CreateProductInput) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return (await response.json()) as Product
}

export async function updateProduct(id: number, product: UpdateProductInput) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  if (response.status === 204) return
  return (await response.json()) as Product
}

export async function deleteProduct(id: number) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }
}
