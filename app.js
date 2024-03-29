import { Application, Session } from "./deps.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { userMiddleware } from "./middlewares/userMiddleware.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { snelmMiddleware } from "./middlewares/snelmMiddleware.js";
import { router } from "./routes/routes.js";

const app = new Application();

app.use(snelmMiddleware);
app.use(Session.initMiddleware());
app.use(errorMiddleware);
app.use(authMiddleware);
app.use(userMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(requestLogger);
app.use(router.routes());

export { app };
