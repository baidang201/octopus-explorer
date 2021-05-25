import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Row, Col, Menu, Dropdown, Layout } from 'antd'
import { DownOutlined } from '@ant-design/icons'

import RealtimeTxs from './realtime-txs'
import RealtimeBlocks from './realtime-blocks'
import CustomSearch from './custom-search'

const { Header, Footer, Content } = Layout

const menu = (
    <Menu>
        <Menu.Item key="1">生态1浏览器</Menu.Item>
        <Menu.Item key="2">生态2浏览器</Menu.Item>
        <Menu.Item key="3">生态3浏览器</Menu.Item>
    </Menu>
)

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header>
                <Row justify="space-between">
                    <Col className={styles.title}>
                        Welcome to octopul-explorer!
                    </Col>
                    <Col>
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                切换网络 <DownOutlined />
                            </a>
                        </Dropdown>
                    </Col>
                </Row>
            </Header>

            <Content>

                <Layout>
                    <Row justify="center">
                        <CustomSearch/>
                    </Row>
                    <Row justify="center">
                        <div>最终区块：9999， 交易总数： 9999， 账户总数：9999 </div>
                    </Row>
                </Layout>

                <Row>
                    <Col span={11}> <RealtimeBlocks/></Col>
                    <Col span={2}></Col>
                    <Col span={11}> <RealtimeTxs/></Col>
                </Row>

            </Content>

            <Footer>
            </Footer>
        </Layout>
    )
}
