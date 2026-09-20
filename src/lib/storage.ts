import type { Workspace } from '../domain/types';
import { demoWorkspace } from '../domain/demo';
import { defaultPreferences } from '../domain/defaults';
const DEMO = 'stilldue:demo:v1';
function withCurrentPreferences(workspace: Workspace): Workspace {
  return {
    ...workspace,
    preferences: { ...defaultPreferences(), ...workspace.preferences },
  };
}
export function loadDemo(): Workspace {
  try {
    const raw = localStorage.getItem(DEMO);
    if (raw) {
      const w = JSON.parse(raw);
      if (Array.isArray(w.deadlines) && Array.isArray(w.boards) && w.preferences)
        return withCurrentPreferences(w);
    }
  } catch {
    /* An unavailable or damaged demo cache should not prevent a fresh demo. */
  }
  return demoWorkspace();
}
export function saveDemo(w: Workspace) {
  localStorage.setItem(DEMO, JSON.stringify(w));
}
export function cacheWorkspace(userId: string, w: Workspace) {
  try {
    localStorage.setItem('stilldue:cache:' + userId, JSON.stringify(w));
  } catch {
    /* Online data remains authoritative if local storage is full. */
  }
}
export function cachedWorkspace(userId: string): Workspace | null {
  try {
    const workspace = JSON.parse(
      localStorage.getItem('stilldue:cache:' + userId) || 'null',
    ) as Workspace | null;
    return workspace ? withCurrentPreferences(workspace) : null;
  } catch {
    return null;
  }
}
export function clearPrivateCache(userId: string) {
  localStorage.removeItem('stilldue:cache:' + userId);
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('stilldue:draft:' + userId)) localStorage.removeItem(key);
  }
}
