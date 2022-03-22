import type { ValidatedEventAPIGatewayProxyEvent } from "@shared/apiGateway";
import Database from "@shared/database";
import { middyfy, handleTimeout } from "@shared/lambda";
import "source-map-support/register";
import "typeorm-aurora-data-api-driver";
import { Connection } from "typeorm";
import { Listing } from "@entities";
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

  const listings = await dbConn
    .createQueryBuilder(Listing, "listings")
    .innerJoin("listings.account", "acc")
    .leftJoinAndSelect("listings.product", "prod")
    .leftJoinAndSelect("prod.manufacturers", "man")
    .leftJoinAndSelect("listings.listing_status", "ls")
    .where("acc.id = :id", { id: accountId })
    .getMany();

  if (listings?.length > 0) {
    return listings;
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
