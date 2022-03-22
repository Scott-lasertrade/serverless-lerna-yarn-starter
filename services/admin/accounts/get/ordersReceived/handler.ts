import type { ValidatedEventAPIGatewayProxyEvent } from "@shared/apiGateway";
import Database from "@shared/database";
import { middyfy, handleTimeout } from "@shared/lambda";
import "source-map-support/register";
import "typeorm-aurora-data-api-driver";
import { Connection } from "typeorm";
import { Order } from "@entities";
import { AppError } from "@shared/appError";
const database = new Database();

const task = async (event) => {
  if (!Number(event.pathParameters.id)) {
    throw new AppError(
      `Incorrect id format provided - ${event.pathParameters.id}`,
      400
    );
  }
  const accountId = Number(event.pathParameters.id);

  const dbConn: Connection = await database.getConnection();

  const offers = await dbConn
    .createQueryBuilder(Order, "orders_received")
    .leftJoinAndSelect("orders_received.buyer", "buyerAccount")
    .leftJoinAndSelect("orders_received.status", "orders_received_status")
    .leftJoinAndSelect("orders_received.listing", "orders_received_listing")
    .leftJoinAndSelect(
      "orders_received_listing.product",
      "orders_received_product"
    )
    .leftJoinAndSelect(
      "orders_received_product.manufacturers",
      "orders_received_manufacturer"
    )
    .innerJoinAndSelect("orders_received_listing.account", "account")
    .where("account.id = :id", { id: accountId })
    .getMany();

  if (offers?.length > 0) {
    return offers;
  }
  return { statusCode: 204 };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event,
  context
) => {
  console.log(event);
  return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
