import { syncCatalog } from '../lib/catalog-sync';
import { json } from '../lib/auth';
export default async function () {
  return json(await syncCatalog());
}
