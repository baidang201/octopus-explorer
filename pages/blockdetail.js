import * as React from "react"
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/react-hooks'

export default function BlockDetail() {
    const [dataSource, setDataSource] = useState([])
    const [extrinsicsString, setExtrinsicsString] = useState("")
    const [loading, setLoading] = useState(true)
    const client = useApolloClient()

    const router = useRouter();
    const { blocknumber } = router.query;
    console.log("####blocknumber params: ", blocknumber)

    //高度，交易数 时间 
    useEffect(() => {
        async function loadBlockData() {
            const rt = await client.query({
                query: gql`
                query blockdetail {
                    block(
                        id: "0x001a41eddf358e72da65577bf4c3d1ad0d5625fd8309f26288aa194046020765"
                    ){
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
                `
            })

            console.log("####block detail rt", rt );

            setDataSource(rt.data.block)
            setLoading(false)

            if (dataSource.extrinsics) {
                let stringList = []
                dataSource.extrinsics.nodes.forEach(item => {
                    stringList.push(item.method.concat("\t\t\t\t\t\t    ", item.args, "\t\t\t\t\t\t    ", item.timestamp, "\n") )
                });

                setExtrinsicsString( stringList.join() )
            }
        }

        loadBlockData()
    }, [client])

  return <div>Block detail <br/>
  <br/>
  {loading
            ? (
                'Loading'
            )
            : (
                dataSource?
                (<div>
                    Height:      &nbsp;   {dataSource.number}<br/>
                    Block Hash:  &nbsp;   {dataSource.id}<br/>
                    Parent Hash: &nbsp;   {dataSource.parentHash}<br/>
                    Block Time:  &nbsp;   {dataSource.timestamp}<br/>
                    <br/>
                    extrinsics 列表<br/>
                    方法   &nbsp;  参数    &nbsp;   时间戳<br/>
                    {extrinsicsString}
                </div>)
                : ('block not found')
            )}
  </div>
}