'use strict';
// Backport for GHSA-vfj7-8cjw-p6xm until braces ships an upstream fix.
module.exports = function assertSafeAst(ast) {
  const stack = [[ast, 0]];
  const seen = new WeakSet();
  let count = 0;
  while (stack.length) {
    const [node, depth] = stack.pop();
    if (!node || typeof node !== 'object') continue;
    if (depth > 64 || ++count > 65536 || seen.has(node)) {
      throw new SyntaxError('Brace pattern exceeds safe AST limits');
    }
    seen.add(node);
    if (Array.isArray(node.nodes)) {
      for (const child of node.nodes) stack.push([child, depth + 1]);
    }
  }
};
