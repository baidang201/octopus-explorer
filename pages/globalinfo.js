import * as React from 'react'
import { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/react-hooks'

export default function Globalinfo() {
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)
    const client = useApolloClient()

    useEffect(() => {
        async function loadGlobalData() {
            const rt = await client.query({
                query: gql`
                query QueryGlobalData {
                    blocks {
                        totalCount
                    }
                    extrinsics {
                        totalCount
                    }
                }
                `,
                fetchPolicy: 'network-only'
            })

            setDataSource(rt.data)
            setLoading(false)
        }

        const intervalId = setInterval(() => {
            loadGlobalData()
        }, 1000 * 3)
        return () => clearInterval(intervalId)
    }, [client])

    return (<div>
        {loading
            ? (
                'Loading'
            )
            : (
                <div>最终区块：{dataSource.blocks.totalCount}， 交易总数： {dataSource.extrinsics.totalCount}</div>
            )}
    </div>)
}
