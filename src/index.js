import express from 'express'
import { authMiddleware } from './auth.js'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createArticle, getArticle, updateArticle, deleteArticle, listArticles } from './articles.js'

const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const FILEPATH = path.join(__dirname, '../data/articles.json')

app.use(express.static(path.join(__dirname, '../assets')))
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

// Pages that anyone can access

app.get('/', (req, res) => {
  res.redirect('/home')
})

app.get('/home', async (req, res) => {
  const articles = await listArticles(FILEPATH)
  res.render('home', { articles })
})

app.get('/article/:id', async (req, res) => {
  const article = await getArticle(req.params.id, FILEPATH)
  res.render('article', { article })
})

// Pages that only the admin can access - check auth.js for credentials

app.get('/admin', authMiddleware, async (req, res) => {
  const articles = await listArticles(FILEPATH)
  res.render('admin', { articles })
})

app.get('/new', authMiddleware, (req, res) => {
  const today = new Date().toLocaleDateString('es-AR')
  res.render('new', { date: today })
})

app.post('/new', authMiddleware, async (req, res) => {
  try {
    const created = await createArticle(req.body, FILEPATH)

    if (!created) {
      return res.status(400).json({ error: 'Invalid article data' })
    }

    res.status(201).redirect('/admin')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/edit/:id', authMiddleware, async (req, res) => {
  const article = await getArticle(req.params.id, FILEPATH)
  res.render('edit', { article })
})

app.post('/edit/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await updateArticle(req.params.id, req.body, FILEPATH)

    if (!updated) {
      return res.status(400).json({ error: 'Invalid article data' })
    }

    res.status(204).redirect('/admin')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await deleteArticle(req.params.id, FILEPATH)

    if (!deleted) {
      return res.status(400).json({ error: 'An error has occurred' })
    }

    res.status(204).redirect('/admin')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
