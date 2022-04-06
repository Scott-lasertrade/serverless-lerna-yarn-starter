import payment_failed from './payment_intent/payment_failed';
import processing from './payment_intent/processing';
import succeeded from './payment_intent/succeeded';

const functions = {
    payment_failed,
    processing,
    succeeded,
};

export default functions;
