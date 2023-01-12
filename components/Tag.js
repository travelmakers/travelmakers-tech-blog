import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'
import { prefix } from '@/lib/prefix'

const Tag = ({ text }) => {
  return (
    <span>
      <a className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
        {text.split(' ').join('-')}
      </a>
    </span>
  )
}

export default Tag
