import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
// dnd-kit
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {useState, useEffect} from 'react'

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors
  // Nếu dùng pointerSensor thì phải đi kèm với touchAction: 'none' mới có thể kéo trên mobile. Nhưng hiện còn bug khi kéo trên mobile
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  
  // Yêu cầu chuột di chuyển 10px mới kích hoạt event, fix trường hợp click bị gọi handleDragEnd event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  
  // Nhấn giữ 250ms và dung sai của cảm ứng (Dẽ hiểu là di chuyển/chênh lệch 5xp) thì mới kích hoạt event
  // Tolerance nó đại diện cho khoảng cách (tính bằng pixel) của chuyển động được chấp nhận trước khi thao tác giữ và kéo (drag) bị hủy bỏ
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  
  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (Kéo linh tinh ra ngoài thì return luôn trách lỗi)
    if (!over) return
    // If drag column is different from drop column
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
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
