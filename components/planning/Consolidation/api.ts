import { BACKEND_URL } from './constants';
import type { Step6ApiRow, Step6Scenario } from './types';

export const fetchJson = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<T>;
};

export const fetchStep6Portfolio = async (): Promise<Step6ApiRow[]> =>
  fetchJson<Step6ApiRow[]>(`${BACKEND_URL}/api/planning/step6-portfolio?validated=1`);

export const fetchStep6Scenarios = async (): Promise<Step6Scenario[]> =>
  fetchJson<Step6Scenario[]>(`${BACKEND_URL}/api/planning/step6/scenarios`);

export const createStep6Scenario = async (payload: Record<string, unknown>): Promise<Step6Scenario> =>
  fetchJson<Step6Scenario>(`${BACKEND_URL}/api/planning/step6/scenarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

export const updateStep6Scenario = async ({
  id,
  payload
}: {
  id: number;
  payload: Record<string, unknown>;
}): Promise<Step6Scenario> =>
  fetchJson<Step6Scenario>(`${BACKEND_URL}/api/planning/step6/scenarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

export const deleteStep6Scenario = async (id: number): Promise<{ ok: boolean }> =>
  fetchJson<{ ok: boolean }>(`${BACKEND_URL}/api/planning/step6/scenarios/${id}`, { method: 'DELETE' });
