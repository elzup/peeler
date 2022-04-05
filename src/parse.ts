import {
  PNode,
  PairLib,
  PNodeBracket,
  PNodeBracketOpen,
  PNodeBuild,
  Options,
} from './types'

function closeBracket(
  { open, close, pos, nodes }: PNodeBracketOpen,
  endPos: number,
  text: string
): PNodeBracket {
  return {
    nodeType: 'bracket',
    open,
    close,
    nodes,
    pos: Object.assign({}, pos, { end: endPos }),
    content: text.substring(pos.start, endPos + 1),
    innerContent: text.substring(pos.start + 1, endPos),
  }
}

function toLib(pairs: string[]): { opens: PairLib; closes: PairLib } {
  const opens: PairLib = {}
  const closes: PairLib = {}

  pairs.forEach(([open, close]) => {
    closes[open] = close
    opens[close] = open
  })
  return { opens, closes }
}

function addText(p: {
  text: string
  parent: PNodeBuild
  start: number
  end: number
  opt: Options
}): void {
  const { text, parent, start, end, opt } = p

  if (start === end && !opt.includeEmpty) {
    return
  }
  const escapers = opt.pairs
    .reduce<string[]>((p, c) => p.concat(c.split('')), [])
    .map((v) => `${opt.escape}${v}`)
  const delEscape = (text: string): string =>
    escapers.reduce((p, c) => p.split(c).join(c[1]), text)

  const depth = parent.pos.depth + 1

  parent.nodes.push({
    nodeType: 'text',
    pos: {
      start,
      end,
      depth,
    },
    content: delEscape(text.substring(start, end)),
  })
}

const safePop = <T>(arr: T[]): T => {
  const item = arr.pop()

  if (item === undefined) {
    throw new Error(`LogicError:`)
  }
  return item
}

export function parse(text: string, opt: Options): PNode[] {
  const { pairs, nestMax, escape } = opt
  const { opens, closes } = toLib(pairs)

  const ns: PNodeBuild[] = [
    {
      nodeType: 'root',
      nodes: [],
      pos: { start: 0, end: 0, depth: -1 },
      content: text,
    },
  ]
  let p = 0

  for (let i = 0; i < text.length; i++) {
    const parent = safePop(ns)
    const c = text[i]
    const atEscape = text[i - 1] === escape

    if (atEscape) {
      ns.push(parent)
    } else if (closes[c] !== undefined) {
      // Hit close bracket
      if (ns.length >= nestMax) {
        throw new Error(
          `NestError: over nest max limit. options: { nestMax: '${opt.nestMax}' }`
        )
      }
      addText({ text, parent, start: p, end: i, opt })
      ns.push(parent)
      ns.push({
        nodeType: 'bracket-open',
        pos: { start: i, depth: parent.pos.depth + 1 },
        open: c,
        close: closes[c],
        nodes: [],
      })
      p = i + 1
    } else if (opens[c] !== undefined) {
      // Hit close bracket
      if (parent.nodeType === 'root' || opens[c] !== parent.open) {
        throw new Error(`ParseError: 404 pair '${opens[c]}' :${i}`)
      }
      const parent2 = safePop(ns)

      addText({ text, parent, start: p, end: i, opt })
      const closedNode = closeBracket(parent, i, text)

      parent2.nodes.push(closedNode)
      ns.push(parent2)
      p = i + 1
    } else {
      // no bracket char
      ns.push(parent)
    }
  }
  const parent = safePop(ns)

  if (parent.nodeType !== 'root') {
    throw new Error(
      `ParseError: 404 pair '${parent.open}' :${parent.pos.start}`
    )
  }
  addText({ text, parent, start: p, end: text.length, opt })
  return parent.nodes
}
