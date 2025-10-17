import { CloseButton, FileUpload, Input, InputGroup, Box } from '@chakra-ui/react'
import * as React from 'react'
import { IconUpload } from '../icons'

type UploadFilesProps = FileUpload.RootProps & {
  accept?: string
  onFileParsed?: (result: unknown) => void
  onFileSelected?: (file: File) => void
  parseCsv?: (file: File) => void
  label?: string
  placeholder?: string
}

export function UploadFiles({
  accept = '.csv,.json',
  onFileParsed,
  onFileSelected,
  parseCsv,
  label,
  placeholder = 'Select file',
  ...props
}: UploadFilesProps) {
  const [fileName, setFileName] = React.useState<string>('')

  const handleHiddenInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setFileName(file.name)
      onFileSelected?.(file)

      const isJson = file.type === 'application/json' || /\.json$/i.test(file.name)
      if (isJson) {
        const text = await file.text()
        const json = JSON.parse(text)
        onFileParsed?.(json)
      } else if (parseCsv) {
        parseCsv(file)
      }
    } catch (err) {
      console.error('File parse error:', err)
    } finally {
      e.currentTarget.value = ''
    }
  }

  const clear = () => setFileName('')

  return (
    <FileUpload.Root gap="1" accept={accept} {...props}>
      <FileUpload.HiddenInput onChange={handleHiddenInputChange} />
      <FileUpload.Label>{label ?? 'Upload file'}</FileUpload.Label>

      <InputGroup
        endElement={
          <Box display="flex" alignItems="center" gap="1">
            <FileUpload.Trigger asChild>
              <Box as="button" aria-label="Choose file" cursor="pointer" display="inline-flex">
                <IconUpload size={18} />
              </Box>
            </FileUpload.Trigger>

            <FileUpload.ClearTrigger asChild>
              <CloseButton
                size="xs"
                variant="plain"
                focusVisibleRing="inside"
                focusRingWidth="2px"
                pointerEvents="auto"
                onClick={clear}
              />
            </FileUpload.ClearTrigger>
          </Box>
        }
      >
        <Input asChild>
          <FileUpload.Trigger>
            <Box
              as="span"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              color={fileName ? 'inherit' : 'fg.muted'}
              fontSize="xs"
            >
              {fileName || placeholder}
            </Box>
          </FileUpload.Trigger>
        </Input>
      </InputGroup>
    </FileUpload.Root>
  )
}
