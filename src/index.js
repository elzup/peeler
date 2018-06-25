// @flow

import type { PNode, Options, PairLib, PNodeBracket } from './types'
import parse from './parse'

function main(text: string, options: Options): PNode[] {
  if (typeof text !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof text}`)
  }
  const defaultOptions: Options = {
    pairs: ['()', '{}', '[]'],
    nestMax: 100,
  }
  const opt = Object.assign(defaultOptions, options || {})
  if (opt.pairs.some(v => v.length < 2)) {
    throw new TypeError(
      `Option error, pairs expected ['[]', '()'...], got ${JSON.stringify(
        opt.pairs
      )}`
    )
  }
  const { opens, closes } = toLib(opt.pairs)

  return parse(text, { opens, closes, nestMax: opt.nestMax })
}

function toLib(pairs: string[]): { opens: PairLib, closes: PairLib } {
  const opens: PairLib = {}
  const closes: PairLib = {}
  for (var i = 0; i < pairs.length; i++) {
    const [open, close] = pairs[i]
    closes[open] = close
    opens[close] = open
  }
  return { opens, closes }
}

export default main
