import axios from 'axios'

export interface ImageData {
  download_url: string
  html_url: string
  name: string
  path: string
  sha: string
  size?: number
  type: string
  url: string
}

export interface RepoConfig {
  owner: string
  avatarUrl: string
  repo: string
  accessToken: string
}

const LOCAL_CONFIG = 'local_config'

export function getConfig(): RepoConfig {
  const defaultConfig = {
    owner: '',
    repo: '',
    accessToken: '',
    avatarUrl: '',
  }
  try {
    const config = localStorage[LOCAL_CONFIG]
    return config ? JSON.parse(config) : defaultConfig
  } catch (error) {
    console.error(error)
    return defaultConfig
  }
}

export function setConfig(config: RepoConfig) {
  localStorage[LOCAL_CONFIG] = JSON.stringify(config)
}

export function getUser(accessToken: string) {
  return axios({
    url: 'https://gitee.com/api/v5/user',
    method: 'GET',
    params: {
      access_token: accessToken,
    },
  })
}

export function getRepos(accessToken: string) {
  return axios({
    url: 'https://gitee.com/api/v5/user/repos',
    method: 'GET',
    params: {
      access_token: accessToken,
      visibility: 'public',
      affiliation: 'owner',
      sort: 'updated',
      page: 1,
      per_page: 20,
    },
  })
}
