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
  repo: string
  accessToken: string
}

const LOCAL_CONFIG = 'local_config'

export function getConfig(): RepoConfig {
  const defaultConfig = {
    owner: '',
    repo: '',
    accessToken: '',
  }
  try {
    const config = window.localStorage[LOCAL_CONFIG]
    return config ? JSON.parse(config) : defaultConfig
  } catch (error) {
    console.error(error)
    return defaultConfig
  }
}

export function setConfig(config: RepoConfig) {
  window.localStorage[LOCAL_CONFIG] = JSON.stringify(config)
}

export function validateConfig({ owner, repo, accessToken }: RepoConfig) {
  return axios({
    url: `https://gitee.com/api/v5/repos/${owner}/${repo}/branches`,
    method: 'GET',
    params: {
      access_token: accessToken,
    },
  })
}
