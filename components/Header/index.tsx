import React, { memo } from 'react'
import Config  from './Config'
import Logo from './Logo'

const Header: React.FC = () => {
  return (
    <header id="header">
      
      <Logo />
      <Config />
    </header>
  )
}

export default memo(Header)
