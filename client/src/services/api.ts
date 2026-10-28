import type { Organ, OrganSummary } from '../types/organ';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<T>(path: string, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const body = (await res.json()) as { error?: string };
        if (body?.error) message = body.error;
      } catch {
        // 忽略响应体解析失败，保留状态码信息
      }
      throw new Error(`请求失败：${message}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('请求超时：请确认后端服务（默认 3001 端口）已启动');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function fetchOrgans(): Promise<OrganSummary[]> {
  return request<OrganSummary[]>('/organs');
}

export function fetchOrganDetail(organId: string): Promise<Organ> {
  return request<Organ>(`/organs/${encodeURIComponent(organId)}`);
}

export function fetchHealth(): Promise<{ status: string; timestamp: string }> {
  return request<{ status: string; timestamp: string }>('/health');
}
