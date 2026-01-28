import * as fs from 'node:fs/promises'
import { getNextId } from '../utils/utils.js'

export const createArticle = async (body, filepath) => {
  if (!body?.title || !body?.content) return null

  let data = []

  try {
    const rawData = await fs.readFile(filepath, 'utf-8')
    data = JSON.parse(rawData)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }

  const newArticle = {
    id: getNextId(data),
    title: body.title,
    date: body.date ?? Date.now(),
    content: body.content
  }

  data.push(newArticle)

  await fs.writeFile(filepath, JSON.stringify(data, null, 2))

  return newArticle
}

export const updateArticle = async (id, body, filepath) => {
  if (!body?.title && !body?.content) return 0

  let data = []

  try {
    const rawData = await fs.readFile(filepath, 'utf-8')
    data = JSON.parse(rawData)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }

  const index = data.findIndex(article => article.id === Number(id))

  if (index < 0) return 0

  data[index] = {
    ...data[index],
    title: body.title,
    content: body.content
  }

  await fs.writeFile(filepath, JSON.stringify(data, null, 2))

  return 1
}

export const deleteArticle = async (id, filepath) => {
  let data = []

  try {
    const rawData = await fs.readFile(filepath, 'utf-8')
    data = JSON.parse(rawData)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }

  const index = data.findIndex(article => article.id === Number(id))

  if (index < 0) return 0

  data.splice(index, 1)

  await fs.writeFile(filepath, JSON.stringify(data, null, 2))

  return 1
}

export const getArticle = async (id, filepath) => {
  let data = []

  try {
    const rawData = await fs.readFile(filepath, 'utf-8')
    data = JSON.parse(rawData)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }

  const index = data.findIndex(article => article.id === Number(id))

  if (index < 0) return 0

  return data[index]
}

export const listArticles = async filepath => {
  let data = []

  try {
    const rawData = await fs.readFile(filepath, 'utf-8')
    data = JSON.parse(rawData)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }

  return data
}
