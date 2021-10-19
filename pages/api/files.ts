// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

export interface DataItem {
    name: string,
    url: string,
}
const dataJsonUrl = 'https://gitee.com/api/v5/repos/burning2017/test-page/contents/data.json'
const STATIC_TOKEN = 'f39de59251d78ec3695ff7bc573c70ac'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<DataItem[]>
) {
    axios({
        url: dataJsonUrl,
        method: 'GET',
        params: {
            access_token: STATIC_TOKEN
        }
    }).then(response => {
        // @ts-ignore
        const { content } = response.data
        let list = JSON.parse(window.decodeURIComponent(atob(content))) as DataItem[]
        res.status(200).json(list)
    }).catch(err => {
        res.status(500).json([])
    })
}
