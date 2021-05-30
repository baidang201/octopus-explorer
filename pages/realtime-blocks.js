import * as React from 'react'
import { useState, useEffect } from 'react'
import { Table, Row } from 'antd'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/react-hooks'
import Link from 'next/link'

const columns = [
    {
        title: '区块高度',
        dataIndex: 'number',
        key: 'number',
        render: (data) => <Link href={{pathname: '/blockdetailbynumber/[number]', query: { number: data }}}>{data}</Link>
    },
    {
        title: '交易数',
        dataIndex: 'totalCount',
        key: 'totalCount'
    },
    {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp'
    }
]

const BLOCK_REQRY = gql`
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
`

export default function RealtimeBlocks() {
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)
    const client = useApolloClient()

    // 高度，交易数 时间
    useEffect(async () => {
        async function loadBlockData() {
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

            setDataSource(rt.data.blocks.nodes.map(item => ({
                key: item.id,
                number: item.number,
                timestamp: item.timestamp,
                totalCount: item.extrinsics.totalCount
            })))
            setLoading(false)
        }

        const intervalId = setInterval(() => {
            loadBlockData()
        }, 1000 * 3)
        return () => clearInterval(intervalId)
    }, [client])

    return (<div>
        <Row>
            <h3>最新区块   获取全部区块</h3>
        </Row>
        {loading
            ? (
                'Loading'
            )
            : (
                <Table dataSource={dataSource} columns={columns} pagination={{ position: ['none'] }}/>
            )}
    </div>)
}
