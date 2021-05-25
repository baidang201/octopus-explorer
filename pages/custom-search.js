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

        if (rt.data.block) {
            return rt.data.block.id
        }

        return rt.data.block
    }

    async function FetchBlockByNum(blockNumber) {
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

        if (rt.data.extrinsic) {
            return rt.data.extrinsic.id
        }
        return rt.data.extrinsic
    }

    // 判断输入类型
    async function checkInputType(str) {
        if (regex.isNum(str)) {
            const blockResult = await FetchBlockByNum(str)
            if (blockResult) {
                return 'blockNumber'
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
        const newValue = value.trim()
        const type = await checkInputType(newValue)
        // // 跳转到区块页
        if (type === 'blockNumber') {
            router.push({
                pathname: '/blockdetailbynumber/[number]',
                query: { number: newValue }
            })
        }
        if (type === 'blockHash') {
            router.push({
                pathname: '/blockdetailbyhash/[hash]',
                query: { hash: newValue }
            })
        }
        // // 跳转到交易页
        if (type === 'transaction') {
            router.push({
                pathname: '/txdetail/[hash]',
                query: { hash: newValue }
            })
        }

        // 跳转到用户页
        // if (type == "account") {
        //   this.$router
        //     .push({
        //       pathname: "/accountdetail/[account]",
        //       query: {
        //         account: this.value,
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
