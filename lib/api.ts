const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    console.error('API Error:', error);
    throw new Error(error.detail ? (typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail)) : response.statusText);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  orders: {
    getAll: () => fetchApi('/orders/'),
    getOne: (id: string) => fetchApi(`/orders/${id}`),
    getStats: () => fetchApi('/orders/stats'),
    create: (data: any) => fetchApi('/orders/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/orders/${id}`, { method: 'DELETE' }),
  },
  products: {
    getAll: () => fetchApi('/products/'),
    getOne: (id: string) => fetchApi(`/products/${id}`),
    getCategories: () => fetchApi('/products/categories'),
    create: (data: any) => fetchApi('/products/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/products/${id}`, { method: 'DELETE' }),
  },
  tables: {
    getAll: () => fetchApi('/tables/'),
    getOne: (id: string) => fetchApi(`/tables/${id}`),
    create: (data: any) => fetchApi('/tables/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/tables/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/tables/${id}`, { method: 'DELETE' }),
  },
  waiters: {
    getAll: () => fetchApi('/waiters/'),
    getOne: (id: string) => fetchApi(`/waiters/${id}`),
    create: (data: any) => fetchApi('/waiters/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/waiters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/waiters/${id}`, { method: 'DELETE' }),
  }
};

