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
    pos: { ...pos, end: endPos },
    content: text.substring(pos.start, endPos + 1),
    innerContent: text.substring(pos.start + 1, endPos),
  }
}

function buildQuoteMap(quoteOpts: string[]): Map<string, string> {
  const quotes = new Map<string, string>()
  for (const [start, end = start] of quoteOpts) {
    quotes.set(start, end)
  }
  return quotes
}

function buildPairMaps(pairs: string[]): { opens: PairLib; closes: PairLib } {
  const opens: PairLib = {}
  const closes: PairLib = {}
  for (const [open, close] of pairs) {
    closes[open] = close
    opens[close] = open
  }
  return { opens, closes }
}

function buildEscapeReplacer(
  pairs: string[],
  escape: string
): (text: string) => string {
  const escapers = pairs
    .reduce<string[]>((p, c) => p.concat(c.split('')), [])
    .map((v) => `${escape}${v}`)
  return (text: string) =>
    escapers.reduce((p, c) => p.split(c).join(c[1]), text)
}

function pushText(
  text: string,
  parent: PNodeBuild,
  start: number,
  end: number,
  removeEscapes: (text: string) => string,
  includeEmpty: boolean
): void {
  if (start === end && !includeEmpty) return
  parent.nodes.push({
    nodeType: 'text',
    pos: { start, end, depth: parent.pos.depth + 1 },
    content: removeEscapes(text.substring(start, end)),
  })
}

export function parse(text: string, opt: Options): PNode[] {
  const { pairs, nestMax, escape } = opt
  const { opens, closes } = buildPairMaps(pairs)
  const quotes = buildQuoteMap(opt.quotes)
  const removeEscapes = buildEscapeReplacer(pairs, escape)

  const ns: PNodeBuild[] = [
    {
      nodeType: 'root',
      nodes: [],
      pos: { start: 0, end: 0, depth: -1 },
      content: text,
    },
  ]
  let p = 0
  let insideQuote: string | null = null
  let quoteStart = 0

  for (let i = 0; i < text.length; i++) {
    const c = text[i]

    if (text[i - 1] === escape) continue

    if (insideQuote !== null) {
      if (insideQuote === c) insideQuote = null
      continue
    }

    if (quotes.has(c)) {
      insideQuote = quotes.get(c)!
      quoteStart = i
      continue
    }

    const top = ns[ns.length - 1]

    if (closes[c] !== undefined) {
      // Open bracket
      if (ns.length > nestMax) {
        throw new Error(
          `NestError: over nest max limit. options: { nestMax: '${nestMax}' }`
        )
      }
      pushText(text, top, p, i, removeEscapes, opt.includeEmpty)
      ns.push({
        nodeType: 'bracket-open',
        pos: { start: i, depth: top.pos.depth + 1 },
        open: c,
        close: closes[c],
        nodes: [],
      })
      p = i + 1
      continue
    }

    if (opens[c] !== undefined) {
      // Close bracket
      if (top.nodeType === 'root' || opens[c] !== top.open) {
        throw new Error(`ParseError: 404 pair '${opens[c]}' :${i}`)
      }
      pushText(text, top, p, i, removeEscapes, opt.includeEmpty)
      ns.pop()
      ns[ns.length - 1].nodes.push(closeBracket(top as PNodeBracketOpen, i, text))
      p = i + 1
    }
  }

  if (insideQuote !== null) {
    throw new Error(`ParseError: 404 quote close ${insideQuote} :${quoteStart}`)
  }

  const root = ns[ns.length - 1]
  if (root.nodeType !== 'root') {
    throw new Error(
      `ParseError: 404 pair '${(root as PNodeBracketOpen).open}' :${root.pos.start}`
    )
  }
  pushText(text, root, p, text.length, removeEscapes, opt.includeEmpty)
  return root.nodes
}
