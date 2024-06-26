'use client'

import React, { useState } from 'react'
import ReactPaginate from 'react-paginate'

interface PaginateProps<T> {
  items: T[]
  itemsPerPage: number
  renderItem: (item: T) => React.ReactNode
}

const Paginate: React.FC<PaginateProps<any>> = ({
  itemsPerPage,
  items = [],
  renderItem,
}) => {
  const [currentPage, setCurrentPage] = useState(0)

  console.log(items)

  // Ensure items is always an array
  if (!Array.isArray(items)) {
    console.error('Expected items to be an array, but got', typeof items)
    items = []
  }

  const indexOfLastItem = (currentPage + 1) * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  return (
    <>
      {currentItems.map((item) => renderItem(item))}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-800">
        <div className="col-span-2 max-w-screen-xl mx-auto">
          <div className="flex justify-center p-3">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={Math.ceil(items.length / itemsPerPage)}
              onPageChange={handlePageChange}
              containerClassName={'pagination flex space-x-2'}
              activeClassName={'active'}
              pageClassName={'px-3 py-1 rounded-md'}
              previousClassName={'px-3 py-1 rounded-md'}
              nextClassName={'px-3 py-1 rounded-md'}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Paginate
