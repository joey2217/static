import React, { memo, useEffect, useState } from 'react'
import {
  Upload,
  Row,
  Col,
  ColProps,
  message,
  Image,
  Typography,
  Modal,
  Button,
} from 'antd'
import Head from 'next/head'
import { RcFile } from 'antd/lib/upload'
import {
  DeleteOutlined,
  FileAddOutlined,
  FileImageOutlined,
  FileOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import { useRecoilValue } from 'recoil'
import { repoConfigState } from '../store/atom'
import { useUpload, useFileList } from '../store/hooks'
import { ImageData } from '../store/types'

const { Paragraph } = Typography

const colProps: ColProps = {
  xs: 24,
  sm: 12,
  md: 6,
  lg: 4,
  xl: 3,
}

const imageReg = /\.(png|jpg|gif|jpeg|webp)$/

const UploadPage: React.FC = () => {
  const repoConfig = useRecoilValue(repoConfigState)
  const upload = useUpload()
  const [file, setFile] = useState<RcFile | null>(null)
  const { fileList, deleteFile } = useFileList()

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
      title: `Do you Want to delete ${file.name}?`,
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
          {repoConfig.owner && `-${repoConfig.owner}/${repoConfig.repo}`}💼
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
        {fileList.map((file) => (
          <Col {...colProps} key={file.name}>
            <div className="file">
              {imageReg.test(file.download_url) ? (
                <Image
                  src={file.download_url}
                  alt={file.name}
                  width={100}
                  height={100}
                />
              ) : (
                <FileAddOutlined style={{ fontSize: '40px' }} />
              )}
            </div>
            <Paragraph ellipsis={{ tooltip: file.download_url }} copyable>
              {file.download_url}
            </Paragraph>
            <div className="delete-icon">
              <Button
                danger
                onClick={() => onDelete(file)}
                icon={<DeleteOutlined />}
                size="small"
              >
                删除
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default memo(UploadPage)
