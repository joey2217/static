import React, { memo, useState } from 'react'
import { SettingOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, message } from 'antd'
import { useRecoilState } from 'recoil'
import { repoConfigState } from '../../store/atom'
import { RepoConfig, setConfig, validateConfig } from '../../store/types'

const Config: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [repoConfig, setRepoConfig] = useRecoilState(repoConfigState)

  const onFinish = (config: RepoConfig) => {
    setLoading(true)
    validateConfig(config)
      .then(() => {
        setRepoConfig(config)
        setConfig(config)
        message.success('验证配置成功!')
        setIsModalVisible(false)
      })
      .catch((err: any) => {
        console.error(err)
        message.success('验证配置失败!')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <>
      <Button
        shape="circle"
        icon={<SettingOutlined />}
        onClick={() => setIsModalVisible(true)}
      />
      <Modal
        title="Gitee仓库配置"
        visible={isModalVisible}
        confirmLoading={loading}
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
            label="用户"
            name="owner"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="仓库"
            name="repo"
            rules={[{ required: true, message: '请输入私人仓库名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="私人令牌"
            name="accessToken"
            rules={[{ required: true, message: '请输入私人令牌!' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default memo(Config)
