export type Pos = {
  start: number
  end: number
  depth: number
}
export type NodeBase = {
  pos: Pos
  content: string
}

export type NodeBaseParent = NodeBase & {
  nodes: PNode[]
}

export type PNodeText = {
  nodeType: 'text'
} & NodeBase

export type PNodeBracket = {
  nodeType: 'bracket'
  open: string
  close: string
  innerContent: string
} & NodeBaseParent

export type PNodeRoot = {
  nodeType: 'root'
} & NodeBaseParent

export type PosOpen = {
  start: number
  depth: number
}
export type PNodeBracketOpen = {
  nodeType: 'bracket-open'
  open: string
  close: string
  pos: PosOpen
  nodes: PNode[]
}

export type PNodeBuild = PNodeRoot | PNodeBracketOpen
export type PNode = PNodeText | PNodeBracket

export type PairLib = { [key: string]: string }
export type QuoteLib = { [key: string]: string }
export type Options = {
  pairs: string[]
  nestMax: number
  escape: string
  includeEmpty: boolean
  quotes: string[]
}

// Flat/Normalized types
export type FlatNodeBase = {
  id: number
  parentId: number | null
  pos: Pos
  content: string
}

export type FlatNodeText = FlatNodeBase & {
  nodeType: 'text'
}

export type FlatNodeBracket = FlatNodeBase & {
  nodeType: 'bracket'
  open: string
  close: string
  innerContent: string
  childIds: number[]
}

export type FlatNode = FlatNodeText | FlatNodeBracket

export type FlatParseResult = {
  nodes: FlatNode[]
  rootIds: number[]
}
