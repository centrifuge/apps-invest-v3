import { IconButton } from '@chakra-ui/react'
import { IconCopy } from '../icons'

export default function CopyToClipboard({ value }: { value: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <IconButton
      onClick={handleCopy}
      size="sm"
      colorPalette="gray"
      variant="ghost"
      _hover={{ bg: 'transparent', border: 'none', boxShadow: 'none' }}
      aria-label="Copy to clipboard"
      w="24px"
      h="24px"
    >
      <IconCopy />
    </IconButton>
  )
}
