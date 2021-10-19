import axios from "axios"

const STATIC_TOKEN = 'f39de59251d78ec3695ff7bc573c70ac'

export interface DataItem {
    name: string,
    url: string,
}

const dataJsonUrl = 'https://gitee.com/api/v5/repos/burning2017/test-page/contents/data.json'
export const BASE_STATIC_URL = 'https://burning2017.gitee.io/test-page/static/'

export async function updateDataJson(data: DataItem) {
    const res = await axios({
        url: dataJsonUrl,
        method: 'GET',
        params: {
            access_token: STATIC_TOKEN
        }
    })
    // @ts-ignore
    const { sha, content } = res.data
    let list = JSON.parse(window.decodeURIComponent(atob(content))) as DataItem[]
    list.push(data)
    const formData = new FormData()
    formData.append('access_token', STATIC_TOKEN)
    formData.append('content', window.btoa(JSON.stringify(list)))
    formData.append('sha', sha)
    formData.append('message', 'update data.json')
    const updateRes = await axios({
        url: dataJsonUrl,
        method: 'PUT',
        data: formData
    })
    console.log(updateRes);
    return updateRes
}