import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface Data {
  type: string
  name: string
  path: string
  sha: string
  download_url: string
  html_url: string
  url: string
}

const STATIC_TOKEN = 'f39de59251d78ec3695ff7bc573c70ac'
const URL =
  'https://gitee.com/api/v5/repos/burning2017/test-page/contents/static'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { message: string }>
) {
  try {
    const { data } = await axios({
      url: URL,
      method: 'GET',
      params: {
        access_token: STATIC_TOKEN,
      },
    })
    console.log(data);
    res.status(200).json(data as Data[])
  } catch (error: any) {
    res
      .status(error.response.status)
      .json({ message: error.response.data.message || 'Something Wrong!' })
  }
}
