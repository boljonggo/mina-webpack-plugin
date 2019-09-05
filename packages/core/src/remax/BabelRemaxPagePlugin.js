import * as t from '@babel/types'
import { addNamed } from '@babel/helper-module-imports'

function pageConfigExpression(path, id) {
  const createId = addNamed(path, 'createPageConfig', 'remax')
  path.insertAfter(
    t.callExpression(
      t.identifier('Page'), [t.callExpression(createId, [id])]))
}

export default () => ({
  visitor: {
    ExportDefaultDeclaration: (path) => {
      if (t.isExpression(path.node.declaration)) {
        const pageId = path.scope.generateUidIdentifier('page')
        const declaration = path.node.declaration
        path.replaceWith(t.variableDeclaration('const', [
          t.variableDeclarator(pageId, declaration)
        ]))
        pageConfigExpression(path, pageId)
        path.stop()
      } else if (t.isFunctionDeclaration(path.node.declaration) ||
                t.isClassDeclaration(path.node.declaration)) {
        const declaration = path.node.declaration
        const pageId = path.scope.generateUidIdentifierBasedOnNode(path.node)
        declaration.id = pageId
        path.replaceWith(declaration)
        pageConfigExpression(path, pageId)
        path.stop()
      }
    }
  }
})
