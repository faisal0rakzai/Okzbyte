import { handleResearchNewsletter } from '../../server/research-rest.mjs';

export default async function handler(req, res) {
  return handleResearchNewsletter(req, res);
}
