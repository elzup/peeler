import { PNode, Options, FlatParseResult } from './types'
import { parse, parseFlat } from './parse'

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

export function peelerFlat(
  text: string,
  options?: Partial<Options>
): FlatParseResult {
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
  return parseFlat(text, opt)
}

export default main
