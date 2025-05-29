import { Container } from "../src/interfaces/express/Container";
import { Server } from "../src/interfaces/express/Server";
import { Configuration } from "../src/config";

const container = new Container();
const server = container.invoke().resolve<Server>("server");
const config = container.invoke().resolve<Configuration>("config");

server
  .start()
  .then(() => {
    console.log(`Environment: ${config.NODE_ENV}`);
    console.log(`Log level: ${config.APP_LOG_LEVEL}`);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
