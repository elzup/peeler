// @flow

import type { PNode, PairLib, PNodeBracket } from './types'

const makeText = content => ({ type: 'text', content })
const makeBracket = (open = '', close = '') => ({
  type: 'bracket',
  open,
  close,
  nodes: [],
})

type Options = { opens: PairLib, closes: PairLib, nestMax: number }

function parse(text: string, options: Options): PNode[] {
  const { opens, closes, nestMax } = options

  const nodeStacks: PNodeBracket[] = [makeBracket()]
  let p = 0
  for (let i = 0; i < text.length; i++) {
    const parent = nodeStacks.pop()
    const c = text[i]
    if (closes[c] !== undefined && nodeStacks.length < nestMax) {
      parent.nodes.push(makeText(text.substring(p, i)))
      nodeStacks.push(parent)
      nodeStacks.push(makeBracket(c, closes[c]))
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
export default parse
