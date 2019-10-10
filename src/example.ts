import peeler from './'
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
