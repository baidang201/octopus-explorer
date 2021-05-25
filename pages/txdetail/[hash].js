import * as React from "react"
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import { gql } from '@apollo/client';
import { useApolloClient } from '@apollo/react-hooks'

export default function TxDetail() {
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)
    const client = useApolloClient()

    const router = useRouter();
    const { hash } = router.query;

    useEffect(() => {
    async function loadBlockData() {
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

        setDataSource(rt.data.extrinsic)
        setLoading(false)
    }

    loadBlockData()
}, [client])

  return <div>tx detail
      <br/>
      <br/>
      {loading
            ? (
                'Loading'
            )
            : (
            <div>
                TxHash: &nbsp;  {dataSource.id}  <br/>
                Status:&nbsp;   {dataSource.isSuccess === true? "true": "false"} <br/>
                Height:&nbsp;   {dataSource.block.number} <br/>
                method:&nbsp;   {dataSource.method}  <br/>
                Time:&nbsp;     {dataSource.timestamp}  <br/>

                args:&nbsp;     { JSON.stringify(dataSource.args)} <br/>
            </div>
        )}
      </div>
}