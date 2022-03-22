import type { ValidatedEventAPIGatewayProxyEvent } from "@shared/apiGateway";
import Database from "@shared/database";
import { middyfy, handleTimeout } from "@shared/lambda";
import "source-map-support/register";
import "typeorm-aurora-data-api-driver";
import { Connection } from "typeorm";
import { Offer } from "@entities";
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

  let dbConn: Connection = await database.getConnection();

  const offers = await dbConn
    .createQueryBuilder(Offer, "offers_made")
    .innerJoinAndSelect("offers_made.account", "account")
    .leftJoinAndSelect("offers_made.status", "offers_made_status")
    .leftJoinAndSelect("offers_made.listing", "offers_made_listing")
    .leftJoinAndSelect("offers_made_listing.product", "offers_made_product")
    .leftJoinAndSelect(
      "offers_made_product.manufacturers",
      "offers_made_manufacturer"
    )
    .leftJoinAndSelect("offers_made_listing.account", "sellerAccount")
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
