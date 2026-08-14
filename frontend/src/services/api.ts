const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('kitchora_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/v1${endpoint}`;

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

// API Services Object
export const api = {
  // Auth
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: (token?: string) => request<any>('/auth/me', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),

  // Kitchens
  getKitchens: (query?: string, cuisine?: string) => {
    let params = new URLSearchParams();
    if (query) params.append('query', query);
    if (cuisine) params.append('cuisine', cuisine);
    return request<any[]>(`/kitchens?${params.toString()}`);
  },
  getKitchenDetail: (id: number) => request<any>(`/kitchens/${id}`),

  // Menu
  getCategories: () => request<any[]>('/menu/categories'),
  getMenuItems: (paramsObj: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    });
    return request<any[]>(`/menu?${params.toString()}`);
  },
  getMenuItemById: (id: number) => request<any>(`/menu/${id}`),

  // Orders
  createOrder: (orderData: any) => request<any>('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getUserOrders: () => request<any[]>('/orders'),
  getOrderById: (id: number) => request<any>(`/orders/${id}`),
  updateOrderStatus: (id: number, status: string) => request<any>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // AI & Search
  aiSearch: (prompt: string) => request<any>('/ai/search', { method: 'POST', body: JSON.stringify({ prompt }) }),
  aiChat: (message: string, session_uuid?: string) => request<any>('/ai/chat', { method: 'POST', body: JSON.stringify({ message, session_uuid }) }),

  // Kitchen Operations & AI Forecast
  getInventory: (kitchenId: number) => request<any[]>(`/inventory/kitchen/${kitchenId}`),
  getDemandForecast: (kitchenId: number) => request<any[]>(`/inventory/forecast/kitchen/${kitchenId}`),

  // Loyalty & Reviews
  getLoyalty: () => request<any>('/loyalty'),
  submitReview: (reviewData: any) => request<any>('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  getKitchenReviews: (kitchenId: number) => request<any[]>(`/reviews/kitchen/${kitchenId}`),

  // Admin
  getAdminAnalytics: () => request<any>('/admin/analytics'),
};
