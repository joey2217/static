import React, { memo } from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from 'antd'
import { repoConfigState } from '../../store/atom'

const Logo: React.FC = () => {
  const repoConfig = useRecoilValue(repoConfigState)
  const goRepo = () => {
    window.open('https://gitee.com/' + repoConfig.owner + '/' + repoConfig.repo)
  }
  return (
    <div>
      <span>Static</span>
      <Button type="link" onClick={goRepo}>
        {repoConfig.owner + '/' + repoConfig.repo}
      </Button>
    </div>
  )
}

export default memo(Logo)
