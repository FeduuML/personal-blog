import base64 from 'base-64'

function decodeCredentials (authHeader) {
  // authHeader = Basic YWRtaW46YWRtaW4=
  const encodedCredentials = authHeader
    .trim()
    .replace(/basic\s+/i, '')

  const decodedCredentials = base64.decode(encodedCredentials)

  return decodedCredentials.split(':')
}

export function authMiddleware (req, res, next) {
  const [username, password] = decodeCredentials(req.headers.authorization || '')

  if (username === 'admin' && password === 'admin') return next()

  res.set('WWW-Authenticate', 'Basic realm="admin"')
  res.status(401).send('Authentication required')
}
