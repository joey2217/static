import React, { memo, useEffect, useState } from 'react'
import { Upload, Button, message } from 'antd'
import axios from 'axios'
import { RcFile } from 'antd/lib/upload'
import { DataItem, updateDataJson, BASE_STATIC_URL } from '../utils'

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<RcFile | null>(null)
  const [fileList, setFileList] = useState<DataItem[]>([])
  useEffect(() => {
    if (file) {
      const { name } = file
      file.text().then((content) => {
        const data = new FormData()
        data.append('access_token', 'f39de59251d78ec3695ff7bc573c70ac')
        data.append('content', window.btoa(encodeURIComponent(content)))
        data.append('message', 'add file ' + name)
        axios({
          url:
            'https://gitee.com/api/v5/repos/burning2017/test-page/contents/static/' +
            name,
          method: 'POST',
          data,
        })
          .then((res) => {
            const item = {
              name,
              // @ts-ignore
              url: res.data.content.html_url,
            }
            updateDataJson(item)
              .then(() => {
                setFileList((list) => list.concat(item))
                // @ts-ignore
                message.success(res.data.commit.message)
              })
              .catch((err) => {
                throw err
              })
          })
          .catch((err) => {
            console.log(err)
            message.error(err.message || '上传失败!')
          })
      })
    }
  }, [file])
  const onBeforeUpload = (file: RcFile) => {
    setFile(file)
    return false
  }

  const onPreview = () => {}

  return (
    <div>
      <Upload
        beforeUpload={onBeforeUpload}
        listType="picture-card"
        fileList={fileList}
        onPreview={onPreview}
      >
        +
      </Upload>
    </div>
  )
}

export default memo(UploadPage)
