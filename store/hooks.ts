import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import axios from 'axios'
import { RcFile } from 'antd/lib/upload'
import { repoConfigState, fileListState } from './atom'
import { blob2Base64 } from '../utils'
import { ImageData } from './types'

export function useUpload() {
  const { owner, repo, accessToken } = useRecoilValue(repoConfigState)
  const setFileList = useSetRecoilState(fileListState)
  return async (file: RcFile) => {
    try {
      const { name } = file
      let fileUrl = await blob2Base64(file)
      fileUrl = fileUrl.replace(/.+;base64,/, '')
      const data = new FormData()
      data.append('access_token', accessToken)
      data.append('content', fileUrl)
      data.append('message', 'add file ' + name)
      const res = await axios({
        url: `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/static/${name}`,
        method: 'POST',
        data,
      })
      const {
        commit: { message: msg },
        content,
      } = res.data as any
      setFileList((list) => list.concat(content as ImageData))
      return msg
    } catch (error: any) {
      console.error(error)
      if (error.response) {
        console.error(error.response)
        throw error.response.data.message || '上传失败!'
      } else if (error.request) {
        console.log(error.request, 'request')
      } else {
        console.log('Error', error.message)
      }
      throw error
    }
  }
}

export function useFileList() {
  const [loading, setLoading] = useState(false)
  const repoConfig = useRecoilValue(repoConfigState)
  const [fileList, setFileList] = useRecoilState(fileListState)
  const { owner, repo, accessToken } = repoConfig
  // get list
  useEffect(() => {
    if (accessToken) {
      setLoading(true)
      axios({
        url: `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/static`,
        method: 'GET',
        params: {
          access_token: accessToken,
        },
      })
        .then((res) => {
          setFileList(res.data as ImageData[])
        })
        .catch((err) => {
          console.error(err)
          setFileList([])
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [repoConfig])

  const deleteFile = async (file: ImageData) => {
    try {
      const path = encodeURIComponent(file.name)
      await axios({
        url: `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/static/${path}`,
        method: 'DELETE',
        params: {
          access_token: accessToken,
          sha: file.sha,
          message: 'delete ' + path,
        },
      })
      setFileList((list) => list.filter((f) => f.sha !== file.sha))
    } catch (error) {
      throw error
    }
  }

  return {
    loading,
    fileList,
    deleteFile,
  }
}
