import { handleArticleList } from '../../server/research-rest.mjs';

export default async function handler(req, res) {
  return handleArticleList(req, res);
}
