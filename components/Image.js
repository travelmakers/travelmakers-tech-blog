import NextImage from 'next/image'
import { prefix } from '@/lib/prefix'

// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ ...rest }) => <NextImage {...rest} src={`${prefix}/${rest?.src}`} />

export default Image
