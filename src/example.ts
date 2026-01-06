import peeler, { peelerFlat } from '.'
import { PNode } from './types'

const print = (node: PNode): void => {
  const nest = '- '.repeat(node.pos.depth)

  if (node.nodeType === 'text') {
    console.log(nest + node.content)
    return
  } else {
    console.log(nest + node.open)
    node.nodes.map(print)
    console.log(nest + node.close)
  }
}

peeler(`(hello(world(\\\\('ω'\\)/){[A](B)}))`).forEach(print)

// --- peelerFlat example ---
console.log('\n--- Flat Structure Visualization (with overlap) ---\n')

const text = `(hello([w]orld(-('ω')-){[A](B)}))`
const { nodes } = peelerFlat(text)

const maxDepth = Math.max(...nodes.map((n) => n.pos.depth))
const width = text.length

for (let d = maxDepth; d >= 0; d--) {
  const line = Array(width).fill(' ')

  nodes
    .filter((n) => n.pos.depth === d)
    .forEach((n) => {
      for (let i = n.pos.start; i < n.pos.end; i++) {
        line[i] = text[i]
      }
      if (n.nodeType === 'bracket') line[n.pos.end] = text[n.pos.end]
    })
  console.log(line.join(''))
}

console.log('\n--- Flat Structure Visualization (no overlap) ---\n')

const put = (s: string, i: number, v: string) =>
  s.slice(0, i) + v + s.slice(i + v.length)

const parts = nodes.flatMap((n) =>
  n.nodeType === 'text'
    ? [{ ...n.pos, v: text.slice(n.pos.start, n.pos.end) }]
    : [
        { ...n.pos, v: n.open },
        { ...n.pos, start: n.pos.end, v: n.close },
      ]
)

const s = Array(maxDepth + 1).fill(' '.repeat(width))

parts.forEach((p) => (s[p.depth] = put(s[p.depth], p.start, p.v)))
s.reverse().forEach((l: string) => console.log(l))

console.log(text)
