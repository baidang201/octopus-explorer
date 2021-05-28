import { gql } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://subql-dev.oct.network/',
  cache: new InMemoryCache()
});

async function getRealtimeTxs() {
    const rt = await client.query({
        query: gql`
        query HeaderQueryTx {
                extrinsics(first: 5, orderBy: TIMESTAMP_DESC) {
                    nodes {
                        block {
                            number
                        }
                        id
                        method
                        timestamp
                        blockId
                    }
                }
            }
        `,
        fetchPolicy: 'network-only'
    })

    return rt
}

async function getTxByHash(hash) {
    const rt = await client.query({
        query: gql`
        query txdetail($id: String!) {
            extrinsic(id: $id) {
                id
                isSuccess
                method
                timestamp
                args
                block {
                    number
                }
                }
            }
        `,
        variables: { id: hash }
    })

    return rt
}

async function fetchTxByHashExist(hash) {
    const rt = await client.query({
        query: gql`
            query txdetail($id: String!) {
                extrinsic(
                    id: $id
                ) {
                    id
                }
            
            }
        `,
        variables: { id: hash }
    })

    if (rt.data.extrinsic) {
        return rt.data.extrinsic.id
    }
    return rt.data.extrinsic
}

export default {getRealtimeTxs, getTxByHash, fetchTxByHashExist}