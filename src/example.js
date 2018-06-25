// @flow

import peeler from '.'
import type { PNode } from './types'

const print = (node: PNode) => {
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

peeler(`(hello(world(\\\\('ω'\\)/){[A](B)}))`).map(print)
