// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface ResponseData {
  message: string
  url?: string
  name?: string
}
const STATIC_TOKEN = 'f39de59251d78ec3695ff7bc573c70ac'
const BASE_URL = 'https://gitee.com/api/v5/repos/burning2017/test-page/contents/static/'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { name, content, message } = req.body
    console.log(name);
    const data = new FormData()
    data.append('access_token', STATIC_TOKEN)
    data.append('content', content)
    data.append('message', message || 'ad`d file ' + name)
    const { data: resData } = await axios({
      url: BASE_URL + name,
      method: 'POST',
      data,
    })
    const {
      commit: { message: msg },
      content: { download_url, name: resName },
    } = resData as any
    res.status(200).json({ message: msg, url: download_url, name: resName })
  } catch (error: any) {
    res.status(error.response.status)
      .json({ message: error.response.data.message || 'Something Wrong!' })
  }
}
