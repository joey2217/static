import type { NextApiRequest, NextApiResponse } from 'next'

const STATIC_TOKEN = 'f39de59251d78ec3695ff7bc573c70ac'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(STATIC_TOKEN)
}
