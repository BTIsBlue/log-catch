const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require('@babel/generator').default;
const template = require('@babel/template');
const t = require("@babel/types");

const LogCatchLoader = function (content, sourceMap, meta){
  const ast = parser.parse(content); // 将代码转换成为ast树
  const { callerName = 'logger', callFnName = 'log', catchAction = 'console.log(error.message)' } = this.query

  traverse(ast,{
    //遍历函数表达式
    FunctionDeclaration(functionPath){
      const functionNode = functionPath.node;
      const bodyResult = []
      let isCatch = false
      for (let statement of functionNode.body.body) {
        const isLoggerCall = t.isExpressionStatement(statement) &&
          t.isCallExpression(statement.expression) &&
          t.isMemberExpression(statement.expression.callee) &&
          statement.expression.callee.property.name === callFnName &&
          t.isMemberExpression(statement.expression.callee.object) &&
          statement.expression.callee.object.property.name === callerName
        // 如果是调用logger则直接将它转换成tryStatement
        if (isLoggerCall) {
          const catchStatement = template.statement(catchAction)();
          const catchClause = t.catchClause(
            t.identifier('error'),
            t.blockStatement([catchStatement])
          );
          const tryBlock = t.blockStatement([statement])
          const tryStatement = t.tryStatement(tryBlock, catchClause);
          bodyResult.push(tryStatement)
          isCatch = true
        } else {
          bodyResult.push(statement)
        }
      }
      if (!isCatch) return
      // 生成新的函数表达式
      const func = t.functionExpression(
        functionNode.id,
        functionNode.params,
        t.blockStatement(bodyResult),
        functionNode.generator,
        functionNode.async
      );
      functionPath.replaceWithMultiple(func);
    }
  })
  //将目标ast转化成代码
  const code = generate(ast).code
  this.callback(null, code, sourceMap, meta);
  return;
}

module.exports = LogCatchLoader;
