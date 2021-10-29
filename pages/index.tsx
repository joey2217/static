import React, { memo, useEffect, useState } from 'react'
import {
  Upload,
  Row,
  Col,
  ColProps,
  message,
  Modal,
  Empty,
  Skeleton,
  Space,
} from 'antd'
import Head from 'next/head'
import { RcFile } from 'antd/lib/upload'
import { InboxOutlined } from '@ant-design/icons'
import { useRecoilValue } from 'recoil'
import { repoConfigState } from '../store/atom'
import { useUpload, useFileList } from '../store/hooks'
import { ImageData } from '../store/types'
import FileCard from '../components/FileCard'

const colProps: ColProps = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 4,
  xxl: 3,
}

const UploadPage: React.FC = () => {
  const repoConfig = useRecoilValue(repoConfigState)
  const upload = useUpload()
  const [file, setFile] = useState<RcFile | null>(null)
  const { loading, fileList, deleteFile } = useFileList()

  useEffect(() => {
    if (file) {
      upload(file)
        .then((msg) => {
          message.success(msg)
        })
        .catch((error) => {
          message.error(error || '上传失败!')
        })
        .finally(() => {
          setFile(null)
        })
    }
  }, [file])

  const onBeforeUpload = (file: RcFile) => {
    setFile(file)
    return false
  }

  const onDelete = (file: ImageData) => {
    Modal.confirm({
      title: `确认删除 ${file.name}?`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteFile(file)
          .then(() => {
            message.success(`删除 ${file.name} 成功!`)
          })
          .catch((err) => {
            console.error(err)
            message.error(`删除 ${file.name}失败!`)
          })
      },
    })
  }
  return (
    <>
      <Head>
        <title>
          💾Static
          {repoConfig.accessToken && `-${repoConfig.owner}/${repoConfig.repo}`}
          💼
        </title>
        <meta name="description" content="static assets,upload" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row gutter={[16, 16]}>
        <Col span={24} className="upload">
          <Upload.Dragger
            beforeUpload={onBeforeUpload}
            className="upload"
            listType="picture-card"
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传</p>
          </Upload.Dragger>
        </Col>
        {loading ? (
          <Col span={24}>
            <Space size="large">
              <Skeleton.Image />
              <Skeleton.Image />
              <Skeleton.Image />
              <Skeleton.Image />
            </Space>
            <Skeleton />
          </Col>
        ) : fileList.length ? (
          fileList.map((file) => (
            <Col {...colProps} key={file.name}>
              <FileCard file={file} onDelete={onDelete} />
            </Col>
          ))
        ) : (
          <Col span={24} className="list-empty">
            <Empty />
          </Col>
        )}
      </Row>
    </>
  )
}

export default memo(UploadPage)
