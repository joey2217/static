import React, { memo } from 'react'

const Header: React.FC = () => {
  return (
    <header id="header">
      <div>Static</div>
    </header>
  )
}

export default memo(Header)
