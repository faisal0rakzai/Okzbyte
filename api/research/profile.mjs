import { handleResearchProfile } from '../../server/research-rest.mjs';

export default async function handler(req, res) {
  return handleResearchProfile(req, res);
}
