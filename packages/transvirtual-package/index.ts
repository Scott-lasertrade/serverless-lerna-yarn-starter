import { AppError } from '../../libs/shared/appError';
import axios from 'axios';

export class ItemDimension {
    constructor(weight: number, length: number, width: number, height: number) {
        this.Quantity = 1;
        this.Weight = weight;
        this.Length = length;
        this.Width = width;
        this.Height = height;
        this.Description = 'box';
    }
    Quantity: number;
    Weight: number;
    Length: number;
    Width: number;
    Height: number;
    Description: string;
}

const transvirtualInstance = axios.create({
    baseURL: 'https://api.transvirtual.com.au/Api',
    timeout: 30000,
    headers: {
        Authorization: process.env.TVAPIKEY,
    },
});

const SHIPPING_ESTIMATE_MULTILPLIER = 1.15;

export const estimatePrice = async (
    senderSuburb: string,
    senderState: string,
    senderPostcode: string,
    receiverSuburb: string,
    receiverState: string,
    receiverPostcode: string,
    items: ItemDimension[]
): Promise<any> => {
    try {
        const response = await transvirtualInstance.post('/PriceEstimate', {
            CustomerCode: process.env.TVCUSTOMER_CODE,
            SenderSuburb: senderSuburb,
            SenderState: senderState,
            SenderPostcode: senderPostcode,
            ReceiverSuburb: receiverSuburb,
            ReceiverState: receiverState,
            ReceiverPostcode: receiverPostcode,
            DimensionsUOM: 'cm',
            WeightUOM: 'kgs',
            Rows: items.map((itm) => ({
                QtyDecimal: itm.Quantity,
                Weight: itm.Weight,
                Length: itm.Length,
                Width: itm.Width,
                Height: itm.Height,
                Description: itm.Description,
            })),
        });
        console.log('TRANSVIRTUAL| Response: ', response.data);

        if (response.data.Data?.Rows?.length > 0) {
            console.log(response.data.Data.Rows);
            let toReturn = response.data.Data.Rows.filter(
                (row) => row.Title === 'Rite On Site'
            );
            if (toReturn.length > 0) {
                return (
                    Math.round(
                        Number(toReturn[0].GrandPrice) *
                            SHIPPING_ESTIMATE_MULTILPLIER *
                            100
                    ) / 100
                );
            }
            toReturn = response.data.Data.Rows.sort(
                (a, b) => parseFloat(b.GrandPrice) - parseFloat(a.GrandPrice)
            );
            return (
                Math.round(
                    Number(toReturn[0].GrandPrice) *
                        SHIPPING_ESTIMATE_MULTILPLIER *
                        100
                ) / 100
            );
        } else {
            throw new AppError(
                'Could not calculate shipping invalid params provided'
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        } else {
            console.log('Unexpected Error', error);
        }

        throw new AppError(error);
    }
};
