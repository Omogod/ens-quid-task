import { lookupArchive } from '@subsquid/archive-registry';
import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor';

// Import contract ABIs from their respective files
import * as EnsRegistryABI from './abi/Registry';
import * as PublicResolverABI from './abi/PublicResolver';
import * as BaseRegistrarABI from './abi/BaseRegistrar';
import * as EthRegistrarControllerOldABI from './abi/EthRegistrarControllerOld';
import * as EthRegistrarControllerABI from './abi/EthRegistrarController';
import * as NameWrapperABI from './abi/NameWrapper';

export const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive('eth-mainnet'),
        chain: 'https://rpc.ankr.com/eth',
    })
    .setFinalityConfirmation(75)
    .setFields({
        transaction: {
            from: true,
            value: true,
            hash: true,
        },
    })
    .setBlockRange({
        from: 6_000_000,
    })
    .addTransaction({
        to: ['0x0000000000000000000000000000000000000000'],
    })
    .addLog({
        address: [
            '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
            '0x314159265dd8dbb310642f98f50c066173c1259b',
            '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
            '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
            '0x253553366Da8546fC250F225fe3d25d0C782303b',
            '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401',
        ],
        topic0: [
            // Topics for events from EnsRegistry
            EnsRegistryABI.events.Transfer.topic,
            EnsRegistryABI.events.NewOwner.topic,
            EnsRegistryABI.events.NewResolver.topic,
            EnsRegistryABI.events.NewTTL.topic,

            // Topics for events from PublicResolver
            PublicResolverABI.events.ABIChanged.topic,
            PublicResolverABI.events.AddrChanged.topic,
            PublicResolverABI.events.AddressChanged.topic,
            PublicResolverABI.events.AuthorisationChanged.topic,
            PublicResolverABI.events.ContenthashChanged.topic,
            PublicResolverABI.events.InterfaceChanged.topic,
            PublicResolverABI.events.NameChanged.topic,
            PublicResolverABI.events.PubkeyChanged.topic,
            // PublicResolverABI.events.Textchanged.topic,
            // PublicResolverABI.events.TextChanged.topic,
            PublicResolverABI.events.VersionChanged.topic,

            // Topics for events from BaseRegistrar
            BaseRegistrarABI.events.NameRegistered.topic,
            BaseRegistrarABI.events.NameRenewed.topic,
            // BaseRegistrarABI.events.NameTransferred.topic,

            // Topics for events from EthRegistrarControllerOld
            EthRegistrarControllerOldABI.events.NameRegistered.topic,
            EthRegistrarControllerOldABI.events.NameRenewed.topic,

            // Topics for events from EthRegistrarController
            EthRegistrarControllerABI.events.NameRegistered.topic,
            EthRegistrarControllerABI.events.NameRenewed.topic,

            // Topics for events from NameWrapper
            NameWrapperABI.events.NameWrapped.topic,
            NameWrapperABI.events.NameUnwrapped.topic,
            NameWrapperABI.events.FusesSet.topic,
            NameWrapperABI.events.ExpiryExtended.topic,
            NameWrapperABI.events.TransferSingle.topic,
            NameWrapperABI.events.TransferBatch.topic,
        ],
    })
    // .setContractABIs({
    //     EnsRegistry: EnsRegistryABI,
    //     PublicResolver: PublicResolverABI,
    //     BaseRegistrar: BaseRegistrarABI,
    //     EthRegistrarControllerOld: EthRegistrarControllerOldABI,
    //     EthRegistrarController: EthRegistrarControllerABI,
    //     NameWrapper: NameWrapperABI,
    // });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
