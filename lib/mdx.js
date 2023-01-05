import { bundleMDX } from 'mdx-bundler'
import fs from 'fs'
import getAllFilesRecursively from './utils/files'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCitation from 'rehype-citation'
import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import remarkCodeTitles from './remark-code-title'
import remarkFootnotes from 'remark-footnotes'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkImgToJsx from './remark-img-to-jsx'
import remarkMath from 'remark-math'
import remarkTocHeadings from './remark-toc-headings'
import { visit } from 'unist-util-visit'

const root = process.cwd()

export function getFiles(type) {
  const prefixPaths = path.join(root, 'data', type)
  const files = getAllFilesRecursively(prefixPaths)
  // Only want to return blog/path and ignore root, replace is needed to work on Windows
  return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'))
}

export function formatSlug(slug) {
  return slug.replace(/\.(mdx|md)/, '')
}

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getFileBySlug(type, slug) {
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  const mdPath = path.join(root, 'data', type, `${slug}.md`)
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8')

  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'esbuild.exe')
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild')
  }

  let toc = []

  // Parsing frontmatter here to pass it in as options to rehype plugin
  const { data: frontmatter } = matter(source)
  const { code } = await bundleMDX({
    source,
    // mdx imports can be automatically source from the components directory
    cwd: path.join(root, 'components'),
    xdmOptions(options) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkCodeTitles,
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
        remarkImgToJsx,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [
          rehypeCitation,
          { bibliography: frontmatter?.bibliography, path: path.join(root, 'data') },
        ],
        [rehypePrismPlus, { ignoreMissing: true }],
      ]
      return options
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      return options
    },
  })

  return {
    mdxSource: code,
    toc,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    },
  }
}

export async function getAllFilesFrontMatter(folder, folder2, folder3, folder4) {
  const prefixPaths = path.join(root, 'data', folder)
  const files = getAllFilesRecursively(prefixPaths)

  const allFrontMatter = []

  files.forEach((file) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    // Remove Unexpected File
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return
    }
    const source = fs.readFileSync(file, 'utf8')
    const { data: frontmatter } = matter(source)
    if (frontmatter.draft !== true) {
      allFrontMatter.push({
        ...frontmatter,
        slug: formatSlug(fileName),
        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
      })
    }
  })

  if (folder2) {
    const prefixPaths2 = path.join(root, 'data', folder2)
    const files2 = getAllFilesRecursively(prefixPaths2)
    files2.forEach((file) => {
      // Replace is needed to work on Windows
      const fileName = file.slice(prefixPaths2.length + 1).replace(/\\/g, '/')
      // Remove Unexpected File
      if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
        return
      }
      const source = fs.readFileSync(file, 'utf8')
      const { data: frontmatter } = matter(source)
      if (frontmatter.draft !== true) {
        allFrontMatter.push({
          ...frontmatter,
          slug: formatSlug(fileName),
          date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
        })
      }
    })
  }

  if (folder3) {
    const prefixPaths3 = path.join(root, 'data', folder3)
    const files3 = getAllFilesRecursively(prefixPaths3)
    files3.forEach((file) => {
      // Replace is needed to work on Windows
      const fileName = file.slice(prefixPaths3.length + 1).replace(/\\/g, '/')
      // Remove Unexpected File
      if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
        return
      }
      const source = fs.readFileSync(file, 'utf8')
      const { data: frontmatter } = matter(source)
      if (frontmatter.draft !== true) {
        allFrontMatter.push({
          ...frontmatter,
          slug: formatSlug(fileName),
          date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
        })
      }
    })
  }

  if (folder4) {
    const prefixPaths4 = path.join(root, 'data', folder4)
    const files4 = getAllFilesRecursively(prefixPaths4)
    files4.forEach((file) => {
      // Replace is needed to work on Windows
      const fileName = file.slice(prefixPaths4.length + 1).replace(/\\/g, '/')
      // Remove Unexpected File
      if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
        return
      }
      const source = fs.readFileSync(file, 'utf8')
      const { data: frontmatter } = matter(source)
      if (frontmatter.draft !== true) {
        allFrontMatter.push({
          ...frontmatter,
          slug: formatSlug(fileName),
          date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
        })
      }
    })
  }

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}
