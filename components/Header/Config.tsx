import React, { memo, useEffect, useState } from 'react'
import { Form, Input, Modal, message, Select, Avatar } from 'antd'
import { useRecoilState } from 'recoil'
import { SettingOutlined } from '@ant-design/icons'
import { repoConfigState } from '../../store/atom'
import { RepoConfig, setConfig, getRepos, getUser } from '../../store/types'

const { Option } = Select
const tokenReg = /^[a-z0-9]{32}$/

const Config: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [repos, setRepos] = useState<string[]>([])
  const [repoConfig, setRepoConfig] = useRecoilState(repoConfigState)

  const onFinish = (config: RepoConfig) => {
    setRepoConfig((val) => ({ ...config, avatarUrl: val.avatarUrl }))
    setConfig(config)
    message.success('验证配置成功!')
    setIsModalVisible(false)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const onBlur = () => {
    const token = form.getFieldValue('accessToken')
    if (tokenReg.test(token)) {
      Promise.all([getUser(token), getRepos(token)])
        .then(([res1, res2]) => {
          console.log(res1, res2)
          const { login, avatar_url } = res1.data as any
          setRepoConfig((c) => ({ ...c, avatarUrl: avatar_url }))
          form.setFieldsValue({ owner: login })
          const repoList = (res2.data as any[]).map((r) => r.name) as string[]
          setRepos(repoList)
          form.setFieldsValue({ repo: repoList[0] })
        })
        .catch((err) => {
          console.error(err)
          message.error('错误Token,获取数据出错!')
        })
    } else {
      message.warn('错误Token!')
    }
  }

  useEffect(() => {
    if (repoConfig.accessToken) {
      getRepos(repoConfig.accessToken).then((res) => {
        const repoList = (res.data as any[]).map((r) => r.name) as string[]
        setRepos(repoList)
      })
    }
  }, [])

  return (
    <>
      <div className="avatar" onClick={() => setIsModalVisible(true)}>
        {repoConfig.avatarUrl ? (
          <Avatar src={repoConfig.avatarUrl} />
        ) : (
          <SettingOutlined />
        )}
      </div>
      <Modal
        title="Gitee仓库配置"
        visible={isModalVisible}
        okText="确定"
        cancelText="取消"
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          name="config"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={repoConfig}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="私人令牌"
            name="accessToken"
            rules={[{ required: true, message: '请输入私人令牌!' }]}
          >
            <Input onBlur={onBlur} placeholder="请输入私人令牌" />
          </Form.Item>
          <Form.Item label="用户" name="owner">
            <Input
              prefix={<Avatar size="small" src={repoConfig.avatarUrl} />}
              disabled
            />
          </Form.Item>
          <Form.Item
            label="仓库"
            name="repo"
            rules={[{ required: true, message: '请输入仓库名称!' }]}
          >
            <Select placeholder="仓库名称" filterOption showSearch>
              {repos.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default memo(Config)
