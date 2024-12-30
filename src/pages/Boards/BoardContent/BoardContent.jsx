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
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import {useState, useEffect} from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

// Active Drag Item Type
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  // Active Drag Item
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  // Update lại orderedColumns khi board thay đổi
  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)
  }, [board])

  // Tìm Một cái column theo cardId
  const findColumnById = (cardId) => {
    // Đoạn này lưu ý, nên dùng c.cards thay vì c.cardOrderIds vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrdeIds mới.
    return orderedColumns.find(c => c?.cards?.map(card => card?._id).includes(cardId))
  }

  // Trigger khi bắt đầu kéo thả
  const handleDragStart = (event) => {
    console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // Trigger khi kéo qua
  const handleDragOver = (event) => {
    // Keo Column thi khong lam gi ca
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // 
    // console.log('handleDragOver', event)
    // If drag card is different from drop card
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (Kéo linh tinh ra ngoài thì return luôn trách lỗi)
    if (!active || !over) return
    
    // Active dragging card: La cai card dang keo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // Over card: La cai card dang tuong tac tren hoac duoi so voi cai card dang keo
    const { id: overCardId } = over

    // Tim 2 cai column theo card id
    const activeColumn = findColumnById(activeDraggingCardId)
    const overColumn = findColumnById(overCardId)
    
    // Neu khong tim thay column nao thi return
    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(card => card?._id === overCardId)
        console.log('overCardIndex', overCardIndex)

        // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;
        // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

        if (nextActiveColumn) {
          // Xóa card ở cái column active cũ
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id === activeDraggingCardId)

          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if (nextOverColumn) { }

        return nextColumns
      })
    }
  }

  // Trigger khi kéo qua
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)

    // Keo Column thi khong lam gi ca
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      console.log('Keo tha card')
      return
    }

    // Keo Column
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
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  // Khi thả element thì sẽ có animation
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({styles: { active: { opacity: '0.5'} } } )
  }
  
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd} >
      <Box sx={{
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={ orderedColumns } />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
