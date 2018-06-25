// @flow

import type { PNode, PairLib, PNodeBracket } from './types'

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

type Options = { opens: PairLib, closes: PairLib, nestMax: number }

function parse(text: string, options: Options): PNode[] {
  const { opens, closes, nestMax } = options

  const ns: PNodeBracket[] = [makeBracket(0, 0, -1)]
  let p = 0
  for (let i = 0; i < text.length; i++) {
    const parent = ns.pop()
    const c = text[i]
    if (closes[c] !== undefined && ns.length < nestMax) {
      parent.nodes.push(makeText(p, i, parent.depth + 1, text.substring(p, i)))
      ns.push(parent)
      ns.push(makeBracket(i, -1, parent.depth + 1, c, closes[c]))
      p = i + 1
    } else if (opens[c] === parent.open) {
      const parent2 = ns.pop()
      parent.nodes.push(makeText(p, i, parent.depth + 1, text.substring(p, i)))
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
  node.nodes.push(makeText(p, text.length, 0, text.substring(p)))
  return node.nodes
}
export default parse
