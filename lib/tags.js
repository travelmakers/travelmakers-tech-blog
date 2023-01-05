import fs from 'fs'
import { getFiles } from './mdx'
import kebabCase from './utils/kebabCase'
import matter from 'gray-matter'
import path from 'path'

const root = process.cwd()

export async function getAllTags(type, type2, type3) {
  const files = await getFiles(type)

  let tagCount = {}
  // Iterate through each post, putting all found tags into `tags`
  await files.reduce(async (promise, file) => {
    await promise
    const source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8')
    const { data } = matter(source)
    if (data.tags && data.draft !== true) {
      data.tags.forEach((tag) => {
        const formattedTag = kebabCase(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  }, Promise.resolve())

  if (type2) {
    const files2 = await getFiles(type2)
    await files2.reduce(async (promise, file) => {
      await promise
      const source = fs.readFileSync(path.join(root, 'data', type2, file), 'utf8')
      const { data } = matter(source)
      if (data.tags && data.draft !== true) {
        data.tags.forEach((tag) => {
          const formattedTag = kebabCase(tag)
          if (formattedTag in tagCount) {
            tagCount[formattedTag] += 1
          } else {
            tagCount[formattedTag] = 1
          }
        })
      }
    }, Promise.resolve())
  }

  if (type3) {
    const files3 = await getFiles(type3)
    await files3.reduce(async (promise, file) => {
      await promise
      const source = fs.readFileSync(path.join(root, 'data', type3, file), 'utf8')
      const { data } = matter(source)
      if (data.tags && data.draft !== true) {
        data.tags.forEach((tag) => {
          const formattedTag = kebabCase(tag)
          if (formattedTag in tagCount) {
            tagCount[formattedTag] += 1
          } else {
            tagCount[formattedTag] = 1
          }
        })
      }
    }, Promise.resolve())
  }

  return tagCount
}
