import { describe, test, expect } from 'vitest'
import { getFileNameWithoutExt } from '..'

describe('utils', () => {
  test('getFileName', () => {
    const filePath = '/xx/test.md'
    const fileName = getFileNameWithoutExt(filePath)
    expect(fileName).toEqual('test')
  })
})
