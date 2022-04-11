import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import {
    Database,
    Listing,
    Product,
    Account,
    Usage,
    CurrencyType,
    UsageType,
    ListingAccessory,
    ListingStatus,
    Manufacturer,
    AddressType,
    Address,
    Country,
    ProductType,
} from '@medii/data';
import { AppError } from '@medii/common';
import { addHSTask, associateContactWithTask } from '@medii/hubspot';
import { sendToEventBridge } from '@medii/eventbridge';
import schema from './schema';

const database = new Database();

async function handleManufacturerCreation(
    transactionalEntityManager: any,
    manufacturers: any[]
) {
    console.log('Manufacturer| Start');
    let manufacturerIds: Manufacturer[] =
        manufacturers?.length > 0
            ? manufacturers
                  .filter((x: { key: string; value: string }) => Number(x.key))
                  .map((itm: { key: string; value: string }) => {
                      const toReturn = new Manufacturer(Number(itm.key));
                      toReturn.name = itm.value;
                      return toReturn;
                  })
            : [];
    const newManufacturers: string[] =
        manufacturers?.length > 0
            ? manufacturers
                  .filter((x: { key: string; value: string }) => !Number(x.key))
                  .map((itm: { key: string; value: string }) => itm.value)
            : [];

    if (newManufacturers?.length > 0) {
        const requiresApproval = true;
        const mappedManufacturers = newManufacturers.map(
            (manufacturer: string) => {
                const newManufacturer = new Manufacturer();
                newManufacturer.name = manufacturer;
                newManufacturer.is_approved = !requiresApproval;
                return newManufacturer;
            }
        );
        console.log('Manufacturer| Adding...', mappedManufacturers);
        const createdManufacturers = await transactionalEntityManager
            .getRepository(Manufacturer)
            .save(mappedManufacturers);
        console.log('Manufacturer| Added');

        manufacturerIds = [...manufacturerIds, ...createdManufacturers];
    }
    console.log('Manufacturer| End');
    return manufacturerIds;
}

async function handleProductCreation(
    transactionalEntityManager: any,
    product_id: number,
    product_version: number,
    product_name: string,
    product_edited: boolean,
    manufacturers: any[]
) {
    let product: Product;
    console.log('Product| Start');
    // Check if we need to create a new product
    if (!product_id) {
        const newProduct = new Product();
        newProduct.name = product_name;
        newProduct.is_active = true;
        newProduct.is_draft = true;
        newProduct.product_type = await transactionalEntityManager
            .createQueryBuilder(ProductType, 'pt')
            .where('name = :productType', { productType: 'Device' })
            .getOneOrFail();

        // Check if there were any new manufacturers added
        newProduct.manufacturers = await handleManufacturerCreation(
            transactionalEntityManager,
            manufacturers
        );

        console.log('Product| Adding...', newProduct);
        product = await transactionalEntityManager
            .getRepository(Product)
            .save(newProduct);
        console.log('Product| Added');
    } else if (product_edited) {
        const updatedProduct = new Product(product_id, product_version);
        updatedProduct.name = product_name;
        updatedProduct.is_active = true;
        updatedProduct.is_draft = true;
        // Check if there were any new manufacturers added

        updatedProduct.manufacturers = await handleManufacturerCreation(
            transactionalEntityManager,
            manufacturers
        );

        console.log('Product| Updating...', updatedProduct);
        product = await transactionalEntityManager
            .getRepository(Product)
            .save(updatedProduct);
        console.log('Product| Updated');
    } else {
        product = new Product(product_id);
    }
    console.log('Product| End');
    return product;
}

async function handleUsageCreation(
    transactionalEntityManager: any,
    usage_type_id: number,
    usage_id: number,
    usage_version: number,
    usage_value: number
) {
    console.log('Usage| Start');
    let usage: Usage;
    if (usage_id) {
        usage = new Usage(usage_id, usage_version);
    } else {
        usage = new Usage();
    }
    if (usage_value) {
        usage.value = usage_value;
    } else if (usage.id) {
        usage.value = 0;
    }
    if (usage_type_id) {
        usage.usage_type = new UsageType(usage_type_id);
    }

    if (usage.value || usage.value === 0) {
        console.log(`Usage| ${usage_id ? 'Updating' : 'Adding'}...`, usage);
        usage = await transactionalEntityManager
            .getRepository(Usage)
            .save(usage);
        console.log(`Usage| ${usage_id ? 'Updated' : 'Added'}...`);
    }
    console.log('Usage| End');
    return usage;
}

async function handleAccessoryCreation(
    transactionalEntityManager: any,
    accessories: any[]
) {
    console.log('Accessories| Start');
    const listing_accessories: ListingAccessory[] =
        accessories?.length > 0
            ? await Promise.all(
                  accessories.map(async (acc) => {
                      let listingAccessory: ListingAccessory;

                      if (acc.active) {
                          if (acc.id) {
                              listingAccessory = new ListingAccessory(
                                  acc.id,
                                  acc.version
                              );
                          } else {
                              listingAccessory = new ListingAccessory();
                          }

                          listingAccessory.usage = await handleUsageCreation(
                              transactionalEntityManager,
                              acc.usage_type_id,
                              acc.usage_id,
                              acc.usage_version,
                              acc.usage_value
                          );

                          listingAccessory.product = new Product(
                              acc.product_id
                          );
                          listingAccessory.product.usage_type = new UsageType(
                              acc.usage_type_id
                          );
                          console.log(
                              `Accessories| ${
                                  acc.id ? 'Updating...' : 'Adding...'
                              }`,
                              acc
                          );
                          return transactionalEntityManager
                              .getRepository(ListingAccessory)
                              .save(listingAccessory);
                      } else if (acc.id) {
                          console.log('Accessories| Removing Accessory:', acc);
                          await transactionalEntityManager
                              .getRepository(ListingAccessory)
                              .delete(acc.id);
                          console.log(
                              'Accessories| Successfully Removed Accessory:',
                              acc
                          );

                          if (acc.usage_id) {
                              console.log(
                                  'Accessories| Removing Usage...',
                                  acc
                              );
                              await transactionalEntityManager
                                  .getRepository(Usage)
                                  .delete(acc.usage_id);
                              console.log('Accessories| Removed Usage');
                          }
                          return null;
                      } else {
                          return null;
                      }
                  })
              )
            : [];
    console.log('Accessories| End');
    return listing_accessories?.length > 0
        ? listing_accessories.filter((x) => !!x)
        : [];
}

async function handleAddressCreation(
    transactionalEntityManager: any,
    address: any,
    save_as_default: boolean,
    account: Account
) {
    console.log('Address| Start');
    let listingAddress: Address = new Address();
    let returnAccount: Account = account;
    let newAddress: Address;
    if (address) {
        if (address.id) {
            newAddress = new Address(address.id, address.version);
        } else {
            newAddress = new Address();
        }

        newAddress.address_line_1 = address.addressLine1;
        newAddress.address_line_2 = address.addressLine2;
        newAddress.suburb = address.suburb;
        newAddress.state = address.state;
        newAddress.post_code = address.postcode;
        newAddress.country = address.country
            ? await transactionalEntityManager
                  .createQueryBuilder(Country, 'c')
                  .where('c.abbreviation = :abbrv', {
                      abbrv: address.country,
                  })
                  .getOneOrFail()
            : null;
        newAddress.address_type = await transactionalEntityManager
            .createQueryBuilder(AddressType, 'at')
            .where('at.name = :type', {
                type: 'Listing',
            })
            .getOneOrFail();

        console.log(
            `Address| ${address.id ? 'Updating' : 'Adding'}...`,
            newAddress
        );
        listingAddress = await transactionalEntityManager
            .getRepository(Address)
            .save(newAddress);
    } else console.log('Address| None Provided');

    if (account && save_as_default) {
        let accountAddress: Address;
        if (account.address) {
            accountAddress = account.address;
        } else {
            accountAddress = new Address();
        }
        accountAddress.address_type = await transactionalEntityManager
            .createQueryBuilder(AddressType, 'at')
            .where('at.name = :type', {
                type: 'Business',
            })
            .getOneOrFail();
        accountAddress.address_line_1 = listingAddress.address_line_1;
        accountAddress.address_line_2 = listingAddress.address_line_2;
        accountAddress.suburb = listingAddress.suburb;
        accountAddress.state = listingAddress.state;
        accountAddress.post_code = listingAddress.post_code;
        accountAddress.country = listingAddress.country;

        console.log('Address| Updating Account Address...', accountAddress);
        account.address = await transactionalEntityManager
            .getRepository(Address)
            .save(accountAddress);
        returnAccount = await transactionalEntityManager
            .getRepository(Account)
            .save(account);
        console.log('Address| Updated Account Address');
    }
    console.log('Address| End');
    return { address: listingAddress, account: returnAccount };
}

const task = async (event) => {
    // HUBSPOT
    const contactId = event.body.hubspotContactId;
    const domain = event.body.domain;

    // LISTING
    const listing_id = event.body.id;
    const listing_version = event.body.version;
    const accountId = event.body.accountId;

    // PRODUCT
    const product_id = event.body.productId;
    const product_version = event.body.productVersion;
    const product_name = event.body.productName;
    const product_edited = event.body.productEdited;
    const manufacturers = event.body.manufacturers;

    // DEVICE DETAILS
    const serial_number = event.body.serialNumber;
    const YOM = event.body.YOM;
    const usageType_id = event.body.usageTypeId;
    const usage_id = event.body.usageId;
    const usage_version = event.body.usageVersion;
    const usage_value = event.body.usageValue;
    const comment = event.body.comment;

    // ACCESSORIES
    const accessories = event.body.accessories;

    // PRICE
    const cost = event.body.cost;
    const reject_below = event.body.autoRejectBelow;
    const accept_above = event.body.autoAcceptAbove;
    const currency_type = 'AUD';

    // LOCATION
    const addressDetails = event.body.address;
    const is_on_ground_floor = event.body.isOnGroundFloor;
    const is_packaging_required = event.body.isPackagingRequired;
    const is_there_steps = event.body.isThereSteps;

    const save_to_account = event.body.saveAsDefault;
    const accountVersion = event.body.accountVersion;
    const accountAddressId = event.body.accountAddressId;
    const accountAddressVersion = event.body.accountAddressVersion;
    const listing_status = event.body.status;

    const dbConn = await database.getConnection();
    let listing: Listing = new Listing();
    let product: Product = new Product();
    await dbConn.transaction(async (transactionalEntityManager) => {
        console.log('Listing| Start');
        // NEW DEVICE
        product = await handleProductCreation(
            transactionalEntityManager,
            product_id,
            product_version,
            product_name,
            product_edited,
            manufacturers
        );

        if (listing_id) {
            console.log(
                'USERID | ',
                event.headers.CurrentUserId ?? event.headers.currentuserid
            );
            console.log('LISTINGID | ', listing_id);
            console.log('LISTINGVERSION | ', listing_version);
            listing =
                (await transactionalEntityManager
                    .createQueryBuilder(Listing, 'l')
                    .innerJoinAndSelect('l.account', 'a')
                    .innerJoinAndSelect('a.users', 'u')
                    .where('u.cognito_user_id = :userId', {
                        userId:
                            event.headers.currentuserid ??
                            event.headers.CurrentUserId,
                    })
                    .andWhere('l.id = :listingId', {
                        listingId: listing_id,
                    })
                    .andWhere('l.version = :listing_Version', {
                        listing_Version: listing_version,
                    })
                    .getOne()) ?? new Listing();
            if (!listing) {
                throw new AppError(
                    'You are not authorized to updated this listing',
                    401
                );
            }
        } else {
            listing = new Listing();
            listing.created_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
        }
        listing.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        listing.product = product;

        // DEVICE DETAILS
        listing.serial_number = serial_number;
        listing.YOM = YOM;
        listing.usage = await handleUsageCreation(
            transactionalEntityManager,
            usageType_id,
            usage_id,
            usage_version,
            usage_value
        );
        listing.comment = comment;

        // ACCESSORIES
        listing.listing_accessories = await handleAccessoryCreation(
            transactionalEntityManager,
            accessories
        );

        listing.listing_accessories =
            listing.listing_accessories?.length > 0
                ? listing.listing_accessories.filter((v) => v != null)
                : [];

        // PRICE
        listing.cost = cost;
        listing.reject_below = reject_below;
        listing.accept_above = accept_above;
        listing.currency_type = await transactionalEntityManager
            .createQueryBuilder(CurrencyType, 'ct')
            .where('ct.abbreviation = :abbv', {
                abbv: currency_type,
            })
            .getOneOrFail();

        // LOCATION
        const curAccount = new Account(accountId, accountVersion);
        curAccount.address = new Address(
            accountAddressId,
            accountAddressVersion
        );
        const { address, account } = await handleAddressCreation(
            transactionalEntityManager,
            addressDetails,
            save_to_account,
            curAccount
        );
        listing.address = address;
        listing.account = account;
        listing.is_on_ground_floor = is_on_ground_floor;
        listing.is_there_steps = is_there_steps;
        listing.is_packaging_required = is_packaging_required;

        // HUBSPOT
        if (listing_status === 'Pending Review' && contactId) {
            let curListing: Listing = new Listing();
            let curProduct = listing.product;
            let tasks = '';
            if (listing_id) {
                curListing = await transactionalEntityManager
                    .createQueryBuilder(Listing, 'l')
                    .leftJoinAndSelect('l.listing_status', 'ls')
                    .where('l.id = :id', {
                        id: listing_id,
                    })
                    .getOneOrFail();
            }
            if (curListing?.listing_status?.name !== 'Pending Review') {
                if (!curProduct.name || !curProduct.manufacturers) {
                    curProduct = await transactionalEntityManager
                        .createQueryBuilder(Product, 'p')
                        .innerJoinAndSelect('p.manufacturers', 'm')
                        .where('p.id = :id', {
                            id: curProduct.id,
                        })
                        .getOneOrFail();
                }

                if (
                    curProduct.manufacturers?.length > 0 &&
                    curProduct.manufacturers.filter((m) => !m.is_approved)
                        .length > 0
                ) {
                    tasks += `- Approve Manufacturer: <a href="${domain}/admin/manufacturer/approvals">${curProduct.manufacturers
                        .filter((m) => !m.is_approved)
                        .map((m) => m.name)
                        .join(', ')}</a> <br/>`;
                }
                if (curProduct.is_draft) {
                    tasks += `- Approve Product: <a href="${domain}/admin/product/create?pid=${
                        product.id
                    }">${
                        curProduct.manufacturers?.length > 0
                            ? curProduct.manufacturers
                                  .map((m) => m.name)
                                  .join(', ')
                            : ''
                    } ${curProduct.name}</a><br/>`;
                }
                tasks += `- Approve Listing: <a href="${domain}/product/${
                    curProduct.id
                }/listing/${curListing.id}">${curListing.YOM} ${
                    curProduct.manufacturers?.length > 0
                        ? curProduct.manufacturers.map((m) => m.name).join(', ')
                        : ''
                } ${curProduct.name}</a>`;

                console.log(
                    'Listing| Publishing HS task...',
                    `${curListing.YOM} ${
                        curProduct.manufacturers?.length > 0
                            ? curProduct.manufacturers
                                  .map((m) => m.name)
                                  .join(', ')
                            : ''
                    } ${
                        curProduct.name
                    } has been updated and requires approval`,
                    tasks
                );
                if (
                    !listing_id ||
                    curListing?.listing_status?.name === 'Draft'
                ) {
                    const task = await addHSTask(
                        tasks,
                        `${curListing.YOM} ${
                            curProduct.manufacturers?.length > 0
                                ? curProduct.manufacturers
                                      .map((m) => m.name)
                                      .join(', ')
                                : ''
                        } ${
                            curProduct.name
                        } has been created and requires approval`
                    );
                    await associateContactWithTask(contactId, task.id);
                } else {
                    const task = await addHSTask(
                        tasks,
                        `${curListing.YOM} ${
                            curProduct.manufacturers?.length > 0
                                ? curProduct.manufacturers
                                      .map((m) => m.name)
                                      .join(', ')
                                : ''
                        } ${
                            curProduct.name
                        } has been updated and requires approval`
                    );
                    await associateContactWithTask(contactId, task.id);
                }
                console.log('Listing| Published HS task');
            }
        }
        // Pending Review
        if (listing_status) {
            listing.listing_status = await transactionalEntityManager
                .createQueryBuilder(ListingStatus, 'ls')
                .where('ls.name = :status', {
                    status: listing_status,
                })
                .getOneOrFail();

            // StateMachine Section
            try {
                const params = {
                    id: 'listing|add_or_update',
                    type: 'refresh_listings',
                };
                console.log(`EVENT BRIDGE| Starting...`, params);
                await sendToEventBridge(
                    process.env.EVENT_BRIDGE ?? '',
                    params,
                    process.env.STAGE ?? ''
                );
            } catch (err) {
                if (err instanceof Error) {
                    console.error(`EVENT BRIDGE| Error: ${err.message}`);
                    throw new AppError(
                        `EVENT BRIDGE| Error: ${err.message}`,
                        400
                    );
                } else {
                    console.error(`EVENT BRIDGE| Unexpected Error: ${err}`);
                    throw new AppError(
                        `EVENT BRIDGE| Unexpected Error: ${err}`,
                        400
                    );
                }
            }
        }

        console.log(`Listing| Saving Listing Id[${listing?.id ?? 'New'}]`);
        listing = await transactionalEntityManager
            .getRepository(Listing)
            .save(listing);
        console.log('Listing| Saved');
        console.log('Listing| End');
    });

    console.log('LISTING AFTER SAVE', listing);

    return { product, listing };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    // console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
