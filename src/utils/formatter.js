export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

// Dùng để tạo placeholder card khi drag & drop hết card khỏi column
export const generatePlaceholderCard = (column) => { 
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceHolderCard: true
  }
}