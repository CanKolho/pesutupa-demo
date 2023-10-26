import { Snelm } from "../deps.js";

const snelm = new Snelm("oak");

const snelmMiddleware = async (ctx, next) => {
  ctx.response = snelm.snelm(ctx.request, ctx.response);

  await next();
};

export { snelmMiddleware };