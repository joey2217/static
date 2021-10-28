import { atom } from 'recoil'
import { RepoConfig, getConfig, ImageData } from './types'

export const repoConfigState = atom<RepoConfig>({
  key: 'repoConfigState',
  default: getConfig(),
})

export const fileListState = atom<ImageData[]>({
  key: 'fileListState',
  default: [],
})
