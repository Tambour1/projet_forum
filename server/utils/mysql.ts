import mysql from "mysql2/promise";
import bluebird from "bluebird";
import type { EventHandler, EventHandlerRequest } from "h3";
export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "toto",
        password: "toto",
        database: "forum_db",
        Promise: bluebird,
      });
      event.context.mysql = connection;
      const response = await handler(event);
      event.context.mysql.end();
      return response;
    } catch (err) {
      return { err };
    }
  });
