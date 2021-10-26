import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// delete with get sha

type Data = {
  message: string
}

const STATIC_TOKEN = 'f39de59251d78ec3695ff7bc573c70ac'
const BASE_URL =
  'https://gitee.com/api/v5/repos/burning2017/test-page/contents/static/'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { path } = req.query
    const { data: fileData } = await axios({
      url: BASE_URL + path,
      method: 'GET',
      params: {
        access_token: STATIC_TOKEN,
      },
    })
    const { sha } = fileData as any
    await axios({
      url: BASE_URL + path,
      method: 'DELETE',
      params: {
        access_token: STATIC_TOKEN,
        sha,
        message: 'delete ' + path,
      },
    })
    res.status(200).json({
      message: 'delete ' + path + ' success!',
    })
  } catch (error: any) {
    res
      .status(error.response.status)
      .json({ message: error.response.data.message || 'Something Wrong!' })
  }
}
