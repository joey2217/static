import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

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
    const { path, sha } = req.query
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
    const status = (error.response && error.response.status) || 500
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      'Something Wrong!'
    res.status(status).json({ message })
  }
}
