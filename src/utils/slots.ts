import { callEdge } from './callEdge';

export async function fetchSlotsState() {
  return callEdge('/slots/state?t=' + Date.now(), { 
    method: 'GET', 
    cache: 'no-store' 
  });
}