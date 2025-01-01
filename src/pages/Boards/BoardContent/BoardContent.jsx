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
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import {useState, useEffect} from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, set } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'

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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

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

  // Cập nhật lại state trong trường hợp di chuyển card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card?._id === overCardId)
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
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Cập nhật lại cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      // nextOverColumn: Column mới
      if (nextOverColumn) { 
        // Check Card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)        
        // Đối với TH dragEnd thì phải cập nhật lại chuẩn dữ liuệ columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: overColumn._id
        }        
        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        // Cập nhật lại cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  // Trigger khi bắt đầu kéo thả
  const handleDragStart = (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    // Nếu kéo card thì lưu lại column cũ
    if (event?.active?.data?.current?.columnId) {
      const oldColumn = findColumnById(event?.active?.id)
      setOldColumnWhenDraggingCard(oldColumn)
    }
  }

  // Trigger khi kéo qua
  const handleDragOver = (event) => {
    // Keo Column thi khong lam gi ca
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
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
    // Handle logic khi keo card qua column khac nha
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger khi kéo qua
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (Kéo linh tinh ra ngoài thì return luôn trách lỗi)
    if (!over) return
    // Keo Card in Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // Active dragging card: La cai card dang keo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // Over card: La cai card dang tuong tac tren hoac duoi so voi cai card dang keo
      const { id: overCardId } = over
      // Tim 2 cai column theo card id
      const activeColumn = findColumnById(activeDraggingCardId)
      const overColumn = findColumnById(overCardId)      
      // Neu khong tim thay column nao thi return
      if (!activeColumn || !overColumn) return
      // Handle logic khi keo card qua column khac nha
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Handle logic khi keo card trong cung 1 column
        // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard )
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)         
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns(prevColumns => { 
          // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)
          // Tìm tới cái Column đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // Cập nhật lại cardOrderIds
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          // Trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
      }
    }    
    // Handle logic khi keo column trong một boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // If drag column is different from drop column
      if (active.id !== over.id) {
        // Lấy ra index của column đang kéo
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Lấy ra index của column đang kéo qua
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        // Clone ra mảng mới
        const newColumns = [...orderedColumns]
        // Thêm column đang kéo vào vị trí mới
        newColumns.splice(oldColumnIndex, 1)
        newColumns.splice(newColumnIndex, 0, orderedColumns[oldColumnIndex])
        // Update lại columnOrderIds
        // const newColumnOrderIds = newColumns.map(c => c._id)
        // Gọi API update lại columnOrderIds
        // ...
        // Update lại state
        setOrderedColumns(newColumns)
      }
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  // Khi thả element thì sẽ có animation
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({styles: { active: { opacity: '0.5'} } } )
  }
  
  return (
    <DndContext
      // Cảm biến kéo thả
      sensors={sensors}
      // Thật toán phát hiện va chạm (Collsion detection algorithm)
      // https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
      collisionDetection={closestCorners}
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
