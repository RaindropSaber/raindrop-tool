const execStatement = (ctx: any, statement: string) =>
  new Function("ctx", `with(ctx){return ${statement}}`)(ctx);
