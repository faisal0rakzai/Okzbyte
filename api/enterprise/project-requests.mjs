import { handleProjectRequest } from '../../server/enterprise.mjs';
export default async function handler(req, res) { return handleProjectRequest(req, res); }
