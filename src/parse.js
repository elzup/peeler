// @flow

import type { PNode, PairLib, PNodeBracket, Options } from './types'

const makeText = (start, end, depth, content) => ({
  type: 'text',
  start,
  end,
  depth,
  content,
})
const makeBracket = (start, end, depth, open = '', close = '') => ({
  type: 'bracket',
  start,
  end,
  depth,
  open,
  close,
  nodes: [],
})

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

function parse(text: string, options: Options): PNode[] {
  const { pairs, nestMax, escape } = options
  const { opens, closes } = toLib(pairs)

  const escapers = pairs
    .reduce((p, c) => p.concat(c.split('')), [])
    .map(v => `${escape}${v}`)

  const ns: PNodeBracket[] = [makeBracket(0, 0, -1)]
  let p = 0
  const delEscape = (text: string) => {
    return escapers.reduce((p, c) => p.split(c).join(c[1]), text)
  }
  for (let i = 0; i < text.length; i++) {
    const parent = ns.pop()
    const c = text[i]
    const atEscape = text[i - 1] === escape
    if (atEscape) {
      ns.push(parent)
    } else if (closes[c] !== undefined && ns.length < nestMax) {
      parent.nodes.push(
        makeText(p, i, parent.depth + 1, delEscape(text.substring(p, i)))
      )
      ns.push(parent)
      ns.push(makeBracket(i, -1, parent.depth + 1, c, closes[c]))
      p = i + 1
    } else if (opens[c] === parent.open) {
      const parent2 = ns.pop()
      parent.nodes.push(
        makeText(p, i, parent.depth + 1, delEscape(text.substring(p, i)))
      )
      parent.end = i
      parent2.nodes.push(parent)
      ns.push(parent2)
      p = i + 1
    } else {
      ns.push(parent)
      // no bracket char
    }
  }
  const node = ns.pop()
  node.nodes.push(makeText(p, text.length, 0, delEscape(text.substring(p))))
  return node.nodes
}
export default parse
