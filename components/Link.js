/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import { prefix } from '@/lib/prefix'

const CustomLink = ({ href, ...rest }) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')
  console.log('link', isInternalLink, isAnchorLink)

  if (isInternalLink) {
    return (
      <Link href={`${prefix}/${href}`}>
        <a {...rest} />
      </Link>
    )
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
}

export default CustomLink
