import * as React from "react"
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';

export default function TxDetail() {
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)
    const client = useApolloClient()

    const router = useRouter();
    const { hash } = router.query;
    console.log("####hash params: ", hash)

    useEffect(() => {
    async function loadBlockData() {
        const rt = await client.query({
            query: gql`
                query txdetail {
                        extrinsic(
                        id: "0x001a41eddf358e72da65577bf4c3d1ad0d5625fd8309f26288aa194046020765"
                        ) {
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
            `
        })

        setDataSource(rt.data.extrinsic)
        setLoading(false)

        let stringList = []
        dataSource.extrinsics.nodes.forEach(item => {
            stringList.push(item.method.concat("\t\t\t\t\t\t    ", item.args, "\t\t\t\t\t\t    ", item.timestamp, "\n") )
        });

        setExtrinsicsString( stringList.join() )
    }

    loadBlockData()
}, [client])

  return <div>tx detail
      <br/>
      <br/>
        TxHash: &nbsp;  {dataSource.id}  <br/>
        Status:&nbsp;   {dataSource.isSuccess === true? "true": "false"} <br/>
        Height:&nbsp;   {dataSource.block.number} <br/>
        method:&nbsp;   {dataSource.method}  <br/>
        Time:&nbsp;     {dataSource.timestamp}  <br/>

        args:&nbsp;     { JSON.stringify(dataSource.args)} <br/>
      </div>
}