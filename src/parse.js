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

function addText({
  text,
  parent,
  start,
  end,
  opt,
}: {
  text: string,
  parent: PNodeBracket,
  start: number,
  end: number,
  opt: Options,
}) {
  if (start === end && !opt.includeEmpty) {
    return
  }
  const escapers = opt.pairs
    .reduce((p, c) => p.concat(c.split('')), [])
    .map(v => `${opt.escape}${v}`)
  const delEscape = (text: string) => {
    return escapers.reduce((p, c) => p.split(c).join(c[1]), text)
  }
  parent.nodes.push(
    makeText(
      start,
      end,
      parent.depth + 1,
      delEscape(text.substring(start, end))
    )
  )
}

function parse(text: string, opt: Options): PNode[] {
  const { pairs, nestMax, escape, includeEmpty } = opt
  const { opens, closes } = toLib(pairs)

  const ns: PNodeBracket[] = [makeBracket(0, 0, -1)]
  let p = 0
  for (let i = 0; i < text.length; i++) {
    const parent = ns.pop()
    const c = text[i]
    const atEscape = text[i - 1] === escape
    if (atEscape) {
      ns.push(parent)
    } else if (closes[c] !== undefined) {
      if (ns.length >= nestMax) {
        throw new Error(
          `NestErorr: over nest max limit. options: { nestMax: '${
            opt.nestMax
          }' }`
        )
      }
      addText({ text, parent, start: p, end: i, opt })
      ns.push(parent)
      ns.push(makeBracket(i, -1, parent.depth + 1, c, closes[c]))
      p = i + 1
    } else if (opens[c] === parent.open) {
      const parent2 = ns.pop()
      addText({ text, parent, start: p, end: i, opt })
      parent.end = i
      parent2.nodes.push(parent)
      ns.push(parent2)
      p = i + 1
    } else if (opens[c] !== undefined && opens[c] !== parent.open) {
      throw new Error(`ParseErorr: 404 pair '${opens[c]}' :${i}`)
    } else {
      ns.push(parent)
      // no bracket char
    }
  }
  const parent = ns.pop()
  if (ns.length > 0) {
    throw new Error(`ParseErorr: 404 pair '${parent.open}' :${parent.start}`)
  }
  addText({ text, parent, start: p, end: text.length, opt })
  return parent.nodes
}
export default parse
