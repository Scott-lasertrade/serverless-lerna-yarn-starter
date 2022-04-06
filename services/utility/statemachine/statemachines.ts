import { StateMachine } from '@medii/common';

const StateMachines: StateMachine = {
    stateMachines: {
        expireOffer: {
            name: 'SMExpireOffer-${self:provider.stage}',
            definition: {
                Comment: 'Schedule Offer Timeout',
                StartAt: 'WaitOfferExpiry',
                States: {
                    WaitOfferExpiry: {
                        Type: 'Wait',
                        TimestampPath: '$.expire_on',
                        Next: 'ExpireOffer',
                    },
                    ExpireOffer: {
                        Type: 'Task',
                        Resource: {
                            'Fn::GetAtt': ['expireOffer', 'Arn'],
                        },
                        End: true,
                    },
                },
            },
        },
        reinstateListings: {
            name: 'SMReinstateListings-${self:provider.stage}',
            definition: {
                Comment: 'Reinstate Listing Status',
                StartAt: 'WaitGracePeriod',
                States: {
                    WaitGracePeriod: {
                        Type: 'Wait',
                        Seconds: 300,
                        Next: 'ReinstateListings',
                    },
                    ReinstateListings: {
                        Type: 'Task',
                        Resource: {
                            'Fn::GetAtt': ['reinstateListings', 'Arn'],
                        },
                        End: true,
                    },
                },
            },
        },
        refreshListingViews: {
            name: 'SMRefreshListingViews-${self:provider.stage}',
            definition: {
                Comment: 'Refresh Listing Views',
                StartAt: 'WaitGracePeriod',
                States: {
                    WaitGracePeriod: {
                        Type: 'Wait',
                        Seconds: 3,
                        Next: 'RefreshListingViews',
                    },
                    RefreshListingViews: {
                        Type: 'Task',
                        Resource: {
                            'Fn::GetAtt': ['refreshListingViews', 'Arn'],
                        },
                        End: true,
                    },
                },
            },
        },
    },
};
export default StateMachines;
