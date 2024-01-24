
import { IInitialNode, IInitialEdges } from '../typing';

export function connectByPlaceholder(placeholders: string[], id: string, nodes: IInitialNode[]): IInitialEdges[] {
  const newEdges: IInitialEdges[] = [];
  placeholders
  .forEach(placeholderItem => {
    const source: IInitialNode | undefined = nodes.find(findVarItem => findVarItem.data.placeholderName === placeholderItem);
    if (source) {
      const target: IInitialNode | undefined = nodes.find(findVarItem => findVarItem.data.originalId === id);
      if (target) {
        newEdges.push({
          id: `e${source.id}-${target.id}`,
          source: source.id,
          target: target.id,
        })
      }
    }
  })

  return newEdges
}

export function connectById(idSource: string, idTarget: string, nodes: IInitialNode[]): IInitialEdges[] {
  const newEdges: IInitialEdges[] = [];
  const source: IInitialNode | undefined = nodes.find(findVarItem => findVarItem.data.originalId === idSource);
  if (source) {
    const target: IInitialNode | undefined = nodes.find(findVarItem => findVarItem.data.originalId === idTarget);
    if (target) {
      newEdges.push({
        id: `e${source.id}-${target.id}`,
        source: source.id,
        target: target.id,
      })
    }
  }

  return newEdges
}