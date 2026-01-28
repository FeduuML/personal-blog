export const getNextId = (data) => {
  if (data.length === 0) return 1
  return Math.max(...data.map(article => article.id)) + 1
}
