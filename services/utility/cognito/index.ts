//  _________________________
// |-------- Public ---------|
// |_________________________|
//      Category
import customMessage from './customMessage';
import postAuth from 'postAuthentication';
import postConf from 'postConfirmation';
import preSignUp from 'preSignUp';
import preTokenG from 'preTokenGeneration';

const functions = {
    customMessage,
    postAuth,
    postConf,
    preSignUp,
    preTokenG,
};

export default functions;
