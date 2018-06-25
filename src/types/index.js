// @flow

export type Pos = {
  start: number,
  end: number,
  depth: number,
}
export type NodeBase = {
  pos: Pos,
}

export type PNodeText = {
  nodeType: 'text',
  content: string,
} & NodeBase

export type PNodeBracket = {
  nodeType: 'bracket',
  open: string,
  close: string,
  nodes: PNode[],
} & NodeBase

export type PNode = PNodeText | PNodeBracket

export type PairLib = { [key: string]: string }
export type Options = {
  pairs: string[],
  nestMax: number,
  escape: string,
  includeEmpty: boolean,
}
