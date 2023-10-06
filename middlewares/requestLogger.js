const requestLogger = async (context, next) => {
  console.log('Request info:');
  console.log('Method:', context.request.method);
  console.log('Path:  ', context.request.url.pathname);

  if (context.request.hasBody) {
    const bodyText = await context.request.body({ type: "text" }).value;

    console.log('Body:  ', bodyText);
  } else {
    console.log('No request body');
  }

  console.log('---');
  await next();
};

export { requestLogger };
