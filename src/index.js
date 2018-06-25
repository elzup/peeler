// @flow

import type { PNode, Options, PairLib, PNodeBracket } from './types'

function main(text: string, options: Options): PNode[] {
  if (typeof text !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof text}`)
  }
  const defaultOptions: Options = {
    pairs: ['()', '{}', '[]'],
  }
  const opt = { ...defaultOptions, ...(options || {}) }
  if (opt.pairs.some(v => v.length < 2)) {
    throw new TypeError(
      `Option error, pairs expected ['[]', '()'...], got ${JSON.stringify(
        opt.pairs
      )}`
    )
  }
  const { opens, closes } = toLib(opt.pairs)
  const makeText = content => ({ type: 'text', content })

  function parse(text: string, head: number = 0, open: string = ''): PNode[] {
    const nodeStacks: PNodeBracket[] = [
      { type: 'bracket', open: '', close: '', nodes: [] },
    ]
    let p = 0
    for (let i = 0; i < text.length; i++) {
      const parent = nodeStacks.pop()
      const c = text[i]
      if (closes[c] !== undefined) {
        parent.nodes.push(makeText(text.substring(p, i)))
        nodeStacks.push(parent)
        nodeStacks.push({
          type: 'bracket',
          open: c,
          close: closes[c],
          nodes: [],
        })
        p = i + 1
      } else if (opens[c] === parent.open) {
        const parent2 = nodeStacks.pop()
        parent.nodes.push(makeText(text.substring(p, i)))
        parent2.nodes.push(parent)
        nodeStacks.push(parent2)
        p = i + 1
      } else {
        nodeStacks.push(parent)
        // no bracket char
      }
    }
    const node = nodeStacks.pop()
    node.nodes.push(makeText(text.substring(p)))
    return node.nodes
  }
  return parse(text)
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
