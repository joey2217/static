import React, { memo, useEffect, useState } from 'react'
import { Upload, Row, Col, ColProps, message, Image, Typography } from 'antd'
import axios from 'axios'
import { RcFile } from 'antd/lib/upload'
import { insert, select } from '../utils/db'
const { Paragraph } = Typography

const colProps: ColProps = {
  xs: 24,
  sm: 12,
  md: 6,
  lg: 4,
  xl: 3,
}
interface ImageData {
  name: string
  url: string
}

const BASE_URL = 'https://gitee.com/burning2017/test-page/raw/master/static/'

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<RcFile | null>(null)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [fileList, setFileList] = useState<ImageData[]>([])

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const url = (reader.result as string).replace(/.+;base64,/, '')
        setFileUrl(url as string)
      }
    }
  }, [file])

  useEffect(() => {
    select().then((list) => {
      setFileList(list)
    })
  }, [])

  useEffect(() => {
    if (fileUrl && file) {
      const { name } = file
      const data = new FormData()
      data.append('access_token', 'f39de59251d78ec3695ff7bc573c70ac')
      data.append('content', fileUrl)
      data.append('message', 'add file ' + name)
      axios({
        url:
          'https://gitee.com/api/v5/repos/burning2017/test-page/contents/static/' +
          name,
        method: 'POST',
        data,
      })
        .then((res) => {
          const {
            commit: { message: msg },
            content: { download_url, name },
          } = res.data as any
          const data = { name, url: download_url }
          setFileList((list) => list.concat(data))
          insert(data)
            .then(() => {
              message.success(msg)
            })
            .catch((err) => {
              throw err
            })
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            message.error(error.response.data.message || '上传失败!')
            const index = fileList.findIndex((f) => f.name === name)
            if (index === -1) {
              const data = { name, url: BASE_URL + name }
              setFileList((list) => list.concat(data))
              insert(data)
            }
          } else if (error.request) {
            console.log(error.request, 'request')
          } else {
            console.log('Error', error.message)
          }
          console.log(error.config)
        })
        .finally(() => {
          setFile(null)
          setFileUrl('')
        })
    }
  }, [fileUrl])
  const onBeforeUpload = (file: RcFile) => {
    setFile(file)
    return false
  }
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} className="upload">
        <Upload.Dragger
          beforeUpload={onBeforeUpload}
          className="upload"
          listType="picture-card"
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" fill="white" fillOpacity="0.01" />
              <mask
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="48"
                height="48"
                style={{
                  maskType: 'alpha',
                }}
              >
                <rect width="48" height="48" fill="#999" />
              </mask>
              <g mask="url(#icon-7b7449f61b9f784)">
                <path
                  d="M6 24.0083V42H42V24"
                  stroke="#999"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M33 15L24 6L15 15"
                  stroke="#999"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23.9917 32V6"
                  stroke="#999"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Col>
      {fileList.map((file) => (
        <Col {...colProps} key={file.name}>
          <Image src={file.url} alt={file.name} />
          <Paragraph ellipsis={{ tooltip: file.url }} copyable>
            {file.url}
          </Paragraph>
        </Col>
      ))}
    </Row>
  )
}

export default memo(UploadPage)
