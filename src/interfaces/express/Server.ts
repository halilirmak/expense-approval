import express from "express";
import * as http from "http";
import { AddressInfo } from "net";
import { Logger } from "../../infra/logger";
import { Configuration } from "../../config";

export class Server {
  private readonly express: express.Application;
  private http: http.Server | any;

  constructor(
    private router: express.Router,
    private logger: Logger,
    private config: Configuration,
  ) {
    this.express = express();
    this.express.use(this.router);
    this.express.use(this.logger.stream());
  }

  public start = async (): Promise<void> => {
    return await new Promise<void>((resolve) => {
      this.http = this.express.listen(this.config.PORT, () => {
        const { port } = this.http.address() as AddressInfo;
        this.logger.info(
          `Application ${this.config.APP_NAME} running on PORT ${port}`,
        );
        resolve();
      });
    });
  };

  public stop = async (): Promise<void> => {
    this.logger.info("Stopping http server...");
    await this.http.close();
  };

  public invoke = (): express.Application => this.express;
}
