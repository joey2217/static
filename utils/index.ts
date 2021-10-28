/**
 * blob 转为 base64
 * @param blob
 */
export function blob2Base64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => {
      const result = reader.result
      if (result) {
        resolve(result as string)
      } else {
        reject()
      }
    }
  })
}
