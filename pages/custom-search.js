import * as React from 'react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/react-hooks'
import { Button, Row, Input } from 'antd'
import regex from '../utils/regex.js'

const { Search } = Input

export default function CustomSearch() {
    const router = useRouter()
    const client = useApolloClient()

    async function FetchBlockByHash(blockHash) {
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

        return rt.data
    }

    async function FetchBlockByNum(blockHeight) {
        const rt = await client.query({
            query: gql`
                query blockdetail($number: BigFloat!) {
                    block(
                        number: $number
                    ){
                        id
                    }
                    }
            `,
            variables: { number: blockHeight }
        })

        return rt.data
    }

    async function fetchTxByHash(hash) {
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

        return rt.data
    }

    // 判断输入类型
    async function checkInputType(str) {
        if (regex.isNum(str)) {
            const blockResult = await FetchBlockByNum(str)
            if (blockResult) {
                return 'blockHeight'
            }
        }
        // 检查是不是合法hash
        if (regex.isHashLegal(str)) {
            const tranResult = await fetchTxByHash(str)
            if (tranResult) {
                return 'transaction'
            }

            const blockResult = await FetchBlockByHash(str)
            if (blockResult) {
                return 'blockHash'
            }
        }

        // 兼容其他格式的账户名
        // let accountResult = await wsReq.wsFetchAccountDetail(str);
        // if (accountResult && accountResult.length && accountResult[0]) {
        //     return "account";
        // }
        return ''
    }

    async function onSearch(value) {
        const type = await checkInputType(value)
        // // 跳转到区块页
        // if (type === 'blockHeight') {
        //     router.push({
        //         pathname: '/blockdetail/[blocknumber]',
        //         query: { blocknumber: value }
        //     })
        // }
        // if (type === 'blockHash') {
        //     router.push({
        //         pathname: '/blockdetail/[blockhash]',
        //         query: { blockhash: value }
        //     })
        // }
        // // 跳转到交易页
        // if (type === 'transaction') {
        //     router.push({
        //         pathname: '/txdetail/[hash]',
        //         query: { hash: value }
        //     })
        // }

        // 跳转到用户页
        // if (type == "account") {
        //   this.$router
        //     .push({
        //       path: "/accountDetails",
        //       query: {
        //         account: this.searchInput,
        //       },
        //     })
        //     .catch((err) => {});
        // }
    }

    return (<div>
        <Row>
            <Search placeholder="搜索区块号 区块哈希 交易哈希" onSearch={onSearch} enterButton />
        </Row>
    </div>)
}
