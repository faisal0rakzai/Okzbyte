import { handleConsultation } from '../../server/enterprise.mjs';
export default async function handler(req, res) { return handleConsultation(req, res); }
