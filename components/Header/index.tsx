import React, { memo } from 'react'
import { Menu } from 'antd'
import styles from './style.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Header: React.FC = () => {
  const router = useRouter()
  return (
    <header className={styles.header}>
      <div className={styles.logo}>LOGO</div>
      <Menu
        className={styles.menu}
        selectedKeys={[router.pathname]}
        mode="horizontal"
      >
        <Menu.Item key="/">
          <Link href="/">
            <a>Home</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="/upload">
          <Link href="/upload">
            <a>Upload</a>
          </Link>
        </Menu.Item>
      </Menu>
    </header>
  )
}

export default memo(Header)
