import React, { memo } from 'react'
import { Card, Image, Typography } from 'antd'
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import { ImageData } from '../../store/types'

const { Meta } = Card
const { Paragraph, Title } = Typography
const imageReg = /\.(png|jpg|gif|jpeg|webp)$/

interface Props {
  file: ImageData
  onDelete: (file: ImageData) => void
}

const FileCard: React.FC<Props> = ({ file, onDelete }) => {
  return (
    <Card
      bodyStyle={{ padding: '8px 14px' }}
      hoverable
      cover={
        imageReg.test(file.download_url) ? (
          <Image
            alt={file.name}
            src={file.download_url}
            height={200}
            fallback="https://via.placeholder.com/100/000000/FFFFFF?text=ERROR"
          />
        ) : (
          <div className="card-cover">
            <FileAddOutlined style={{ fontSize: '40px' }} />
          </div>
        )
      }
      actions={[<DeleteOutlined key="delete" onClick={() => onDelete(file)} />]}
    >
      <Meta
        title={
          <Title level={5} ellipsis={{ tooltip: file.name }}>
            {file.name}
          </Title>
        }
        description={
          <Paragraph ellipsis={{ tooltip: file.download_url }} copyable>
            {file.download_url}
          </Paragraph>
        }
      />
    </Card>
  )
}

export default memo(FileCard)
