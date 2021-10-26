import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type Data = {
    sha?: string
    message: string
}

const STATIC_TOKEN = 'f39de59251d78ec3695ff7bc573c70ac'
const BASE_URL = 'https://gitee.com/api/v5/repos/burning2017/test-page/contents/static/'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const { path } = req.query
        const { data } = await axios({
            url: BASE_URL + path,
            method: "GET",
            params: {
                access_token: STATIC_TOKEN
            }
        })
        const { sha } = data as any
        res.status(200).json({ message: 'success', sha })
    } catch (error: any) {
        res.status(error.response.status)
            .json({ message: error.response.data.message || 'Something Wrong!' })
    }
}
