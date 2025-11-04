import { useState, useMemo, useEffect, ReactNode } from 'react'
import { Key, genericFlagsConfig } from './config'
import { DebugFlagsContext, Flags, initialFlagsState } from './context'
import { Button, CloseButton, Drawer, Portal, Field, Input, Checkbox, NativeSelect, Stack } from '@chakra-ui/react'

function DebugFlagsImpl({
  children,
  onChange,
  customFlags,
}: {
  children?: ReactNode
  onChange?: (state: Flags) => void
  customFlags?: string[]
}) {
  const [state, setState] = useState(initialFlagsState)
  const [tracked, setTracked] = useState<Record<string, string>>({})

  const ctx = useMemo(
    () => ({
      flags: Object.entries(state).reduce((obj, [key, value]) => {
        const conf = genericFlagsConfig[key as Key]
        Reflect.set(obj, key, 'options' in conf ? conf.options[value as string] : value)
        return obj
      }, {} as Flags),
      register(id: number, keys: string[]) {
        setTracked((prev) => ({ ...prev, [id]: keys }))
      },
      unregister(id: number) {
        setTracked((prev) => ({ ...prev, [id]: undefined }))
      },
    }),
    [state]
  )

  const usedKeys = new Set(Object.values(tracked).flat())

  useEffect(() => {
    onChange?.(state)
    if (state.persistDebugFlags) {
      localStorage.setItem('debugFlags', JSON.stringify(state))
    }
    if (!state.persistDebugFlags && localStorage.getItem('debugFlags')) {
      localStorage.removeItem('debugFlags')
    }
  }, [state])

  return (
    <DebugFlagsContext.Provider value={ctx}>
      {children}
      <Panel
        state={state}
        usedKeys={usedKeys}
        onChange={(key: Key, val: string | boolean) => setState((prev) => ({ ...prev, [key]: val }))}
        customFlags={customFlags}
      />
    </DebugFlagsContext.Provider>
  )
}

const Panel = ({
  state,
  usedKeys,
  onChange,
  customFlags = [],
}: {
  state: Flags
  usedKeys: Set<string>
  onChange: (key: Key, val: string | boolean) => void
  customFlags?: string[]
}) => {
  const flags = ['address', 'persistDebugFlags', 'showMainnet', ...customFlags]

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="solid" size="sm" style={{ position: 'fixed', bottom: '8px', right: '8px' }}>
          open debug panel
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Debug Panel</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap="4">
                {Object.entries(genericFlagsConfig).map(([key, obj]) => {
                  if (!flags.includes(key)) {
                    return null
                  }

                  const used = usedKeys.has(key) || obj.alwaysShow
                  const value = state[key as Key]

                  let element
                  if (obj.type === 'checkbox') {
                    element = (
                      <Checkbox.Root
                        key={key}
                        checked={value as boolean}
                        onCheckedChange={(checked) => onChange(key as Key, checked.checked)}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{key}</Checkbox.Label>
                      </Checkbox.Root>
                    )
                  } else if (obj.type === 'select' && obj.options) {
                    element = (
                      <NativeSelect.Root key={key} size="xl" variant="outline" width="auto" me="-1">
                        <NativeSelect.Field
                          value={value as string}
                          onChange={(e) => onChange(key as Key, e.target.value)}
                          fontSize="sm"
                        >
                          {Object.keys(obj.options).map((option) => (
                            <option key={`${option}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    )
                  } else {
                    element = (
                      <Field.Root key={key} invalid={!used}>
                        <Field.Label>{key}</Field.Label>
                        <Input value={value as string} onChange={(e) => onChange(key as Key, e.target.value)} />
                        <Field.ErrorText>unused</Field.ErrorText>
                      </Field.Root>
                    )
                  }

                  return used ? element : null
                })}
              </Stack>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="xl" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

export default DebugFlagsImpl
