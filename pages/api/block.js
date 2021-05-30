import { gql } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://subql-dev.oct.network/',
  cache: new InMemoryCache()
});

async function getRealtimeBlocks() {
    const rt = await client
        .query({
            query: gql`
            query HeaderQueryBlock {
                    blocks(first: 5, orderBy: NUMBER_DESC) {
                    nodes {
                        id
                        number
                        timestamp
                        extrinsics {
                            totalCount
                        }
                    }
                    }
            }
        `,
            fetchPolicy: 'network-only'
        })

    return rt
}

async function getBlockByHash(hash) {
    const rt = await client.query({
        query: gql`
        query blockdetail($id: String!) {
            block(id: $id) {
                    id
                    number
                    parentHash
                    timestamp
                    extrinsics {
                        nodes {
                            method
                            args
                            timestamp
                        }
                    }
                }
            }
        `,
        variables: { id: hash }
    })

    return rt
}

async function getBlockByNumber(number) {
    const rt = await client.query({
        query: gql`
        query blockdetailbynumber($number: BigFloat!)  {
            blocks(filter: {number: {equalTo: $number}}) {
                nodes {
                    id
                    number
                    parentHash
                    timestamp
                    extrinsics {
                        nodes {
                            method
                            args
                            timestamp
                        }
                    }
                }
                }
            }
        `,
        variables: { number: number }
    })

    return rt
}

async function fetchBlockByHashExist(blockHash) {
    const rt = await client.query({
        query: gql`
            query blockdetail($id: String!) {
                block(
                    id: $id
                ){
                        id
                    }
                }
        `,
        variables: { id: blockHash }
    })

    if (rt.data.block) {
        return rt.data.block.id
    }

    return rt.data.block
}

async function fetchBlockByNumExist(blockNumber) {
    const rt = await client.query({
        query: gql`
            query blockdetail($number: BigFloat!) {
                blocks(filter: {number: {equalTo: $number}}) {
                    nodes {
                        id
                    }
                }
                }
        `,
        variables: { number: blockNumber }
    })

    if (rt.data.blocks.nodes[0]) {
        return rt.data.blocks.nodes[0].id
    }
    return rt.data.blocks.nodes[0]
}

export default {getRealtimeBlocks, getBlockByHash,getBlockByNumber, fetchBlockByNumExist, fetchBlockByHashExist}