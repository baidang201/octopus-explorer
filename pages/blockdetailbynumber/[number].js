import * as React from "react"
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/react-hooks'

export default function BlockDetail() {
    const [dataSource, setDataSource] = useState([])
    const [extrinsicsString, setExtrinsicsString] = useState("")
    const [eventsString, setEventsString] = useState("")
    const [loading, setLoading] = useState(true)
    const client = useApolloClient()

    const router = useRouter();
    const { number } = router.query;

    //高度，交易数 时间 
    useEffect(() => {
        async function loadBlockData() {
            const rt = await client.query({
                query: gql`
                query blockdetailbynumber($number: BigFloat!)  {
                    blocks(filter: {number: {equalTo: $number}}) {
                        nodes {
                            id
                            number
                            parentHash
                            specVersion
                            timestamp
                            extrinsics {
                                nodes {
                                    method
                                    args
                                    timestamp
                                }
                            }
                            events {
                                nodes {
                                    method
                                    data
                                }
                            }
                        }
                        }
                    }
                `,
                variables: { number: number }
            })

            setDataSource(rt.data.blocks.nodes[0])
            
            if (rt.data.blocks.nodes[0].extrinsics) {
                let stringList = []
                rt.data.blocks.nodes[0].extrinsics.nodes.forEach(item => {
                    stringList.push(item.method.concat("\t\t\t\t\t\t    ", item.args, "\t\t\t\t\t\t    ", item.timestamp, "\n") )
                });

                setExtrinsicsString( stringList.join() )
            }

            if (rt.data.blocks.nodes[0].events) {
                let stringList = []
                rt.data.blocks.nodes[0].events.nodes.forEach(item => {
                    stringList.push(item.method.concat("\t\t\t\t\t\t    ", item.data) )
                });

                setEventsString( stringList.join() )
            }

            setLoading(false)
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
                    specVersion: &nbsp;   {dataSource.specVersion}<br/>
                    Block Time:  &nbsp;   {dataSource.timestamp}<br/>
                    <br/>
                    extrinsics 列表<br/>
                    方法   &nbsp;  参数    &nbsp;   时间戳<br/>
                    {extrinsicsString}
                    <br/>
                    <br/>

                    events 列表<br/>
                    方法   &nbsp;  数据    &nbsp;<br/>
                    {eventsString}
                </div>)
                : ('block not found')
            )}
  </div>
}