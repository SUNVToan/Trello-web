import {useState, useEffect} from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
// dnd-kit
import { DndContext } from '@dnd-kit/core'

function BoardContent({ board }) {
  const [orderedColumns, setOrderedColumns] = useState([])
  
  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)
  }, [board])

  const handleDragEnd = (event) => {
    console.log('handleDragEnd', event)
    const { active, over } = event
    
    if (active.id !== over.id) {
      // Lấy ra index của column đang kéo
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Lấy ra index của column đang kéo qua
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      // Clone ra mảng mới
      const newColumns = [...orderedColumns]
      // Thêm column đang kéo vào vị trí mới
      newColumns.splice(oldIndex, 1)
      newColumns.splice(newIndex, 0, orderedColumns[oldIndex])
      // Update lại columnOrderIds
      // const newColumnOrderIds = newColumns.map(c => c._id)
      // Gọi API update lại columnOrderIds
      // ...
      // Update lại state
      setOrderedColumns(newColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={ orderedColumns } />
      </Box>
    </DndContext>
  )
}

export default BoardContent
