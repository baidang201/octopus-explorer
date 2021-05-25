import * as React from 'react'
import { useState, useEffect } from 'react'
import { Table, Row } from 'antd'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/react-hooks'

const columns = [
    {
        title: '区块高度',
        dataIndex: 'number',
        key: 'number'
    },
    {
        title: '方法',
        dataIndex: 'method',
        key: 'method'
    },
    {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp'
    }
]

export default function RealtimeTxs() {
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)
    const client = useApolloClient()

    // 高度，交易数 时间
    useEffect(() => {
        async function loadTxData() {
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

            setDataSource(rt.data.extrinsics.nodes.map(item => ({
                key: item.id,
                number: item.block.number,
                method: item.method,
                timestamp: item.timestamp
            })))
            setLoading(false)
        }

        const intervalId = setInterval(() => {
            loadTxData()
        }, 1000 * 3)
        return () => clearInterval(intervalId)
    }, [client])

    return (<div>
        <Row>
            <h3>最新交易   获取全部交易</h3>
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
