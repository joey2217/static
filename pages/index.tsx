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
} from 'antd'
import axios from 'axios'
import { RcFile } from 'antd/lib/upload'

const { Paragraph } = Typography

const colProps: ColProps = {
  xs: 24,
  sm: 12,
  md: 6,
  lg: 4,
  xl: 3,
}
interface ImageData {
  download_url: string
  html_url: string
  name: string
  path: string
  sha: string
  size?: number
  type: string
  url: string
}

const BASE_URL =
  'https://gitee.com/api/v5/repos/burning2017/test-page/contents/static/'
const TOKEN = 'f39de59251d78ec3695ff7bc573c70ac'

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
    axios({
      url: '/api/files',
      method: 'GET',
    })
      .then(({ data }) => {
        setFileList(data as ImageData[])
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  useEffect(() => {
    if (fileUrl && file) {
      const { name } = file
      const data = new FormData()
      data.append('access_token', TOKEN)
      data.append('content', fileUrl)
      data.append('message', 'add file ' + name)
      axios({
        url: BASE_URL + name,
        method: 'POST',
        data,
      })
        .then((res) => {
          const {
            commit: { message: msg },
            content,
          } = res.data as any
          setFileList((list) => list.concat(content as ImageData))
          message.success(msg)
        })
        .catch((error) => {
          if (error.response) {
            console.error(error.response)
            message.error(error.response.data.message || '上传失败!')
          } else if (error.request) {
            console.log(error.request, 'request')
          } else {
            console.log('Error', error.message)
          }
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

  const onDelete = (file: ImageData) => {
    const title = `Do you Want to delete ${file.name}?`
    Modal.confirm({
      title,
      onOk() {
        axios({
          url: '/api/delete',
          method: 'DELETE',
          params: {
            path: encodeURIComponent(file.name),
            sha: file.sha,
          },
        })
          .then(() => {
            setFileList((list) => list.filter((item) => item.sha !== file.sha))
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
          <Image src={file.download_url} alt={file.name} />
          <Paragraph ellipsis={{ tooltip: file.download_url }} copyable>
            {file.download_url}
          </Paragraph>
          <div className="delete-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => onDelete(file)}
            >
              <rect width="48" height="48" fill="white" fillOpacity="0.01" />
              <path
                d="M9 10V44H39V10H9Z"
                fill="none"
                stroke="#666"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M20 20V33"
                stroke="#666"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28 20V33"
                stroke="#666"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 10H44"
                stroke="#666"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 10L19.289 4H28.7771L32 10H16Z"
                fill="none"
                stroke="#666"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Col>
      ))}
    </Row>
  )
}

export default memo(UploadPage)
