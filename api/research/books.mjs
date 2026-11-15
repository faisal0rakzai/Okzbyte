import { handleResearchBooks } from '../../server/research-rest.mjs';

export default async function handler(req, res) {
  return handleResearchBooks(req, res);
}
