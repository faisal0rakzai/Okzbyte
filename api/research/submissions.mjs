import { handleResearchSubmission } from '../../server/research-rest.mjs';

export default async function handler(req, res) {
  return handleResearchSubmission(req, res);
}
