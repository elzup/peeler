import { PNode, Options } from './types'
import { parse } from './parse'

function main(text: string, options?: Partial<Options>): PNode[] {
  if (typeof text !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof text}`)
  }
  const defaultOptions: Options = {
    pairs: ['()', '{}', '[]'],
    nestMax: 100,
    escape: '\\',
    includeEmpty: false,
    quotes: [],
  }
  const opt = Object.assign(defaultOptions, options || {})

  if (opt.pairs.some((v) => v.length < 2)) {
    throw new TypeError(
      `Option error, pairs expected ['[]', '()'...], got ${JSON.stringify(
        opt.pairs
      )}`
    )
  }
  return parse(text, opt)
}

export default main
