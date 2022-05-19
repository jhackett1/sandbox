import { useEffect, useRef, useState } from "react"
import { useVirtual } from "react-virtual"

const VirtualTestApp = (): React.ReactElement => {
  const [items, setItems] = useState([])

  const parentRef = useRef(null)

  const rowVirtualizer = useVirtual({
    parentRef,
    size: items.length, // 1000
  })

  useEffect(
    () =>
      setItems(
        [...Array(1000).keys()].map(key => ({
          id: key,
          name: Math.random() * 10,
          bio: Math.random() * 300,
        }))
      ),
    []
  )

  return (
    <>
      <p>
        Rendering {rowVirtualizer.virtualItems.length} of {items.length}
      </p>

      <div
        ref={parentRef}
        style={{
          height: `150px`, // FIXED HEIGHT—NEEDED
          overflow: "auto", // NEEDED
          border: "5px solid blue",
        }}
      >
        <ul
          style={{
            height: `${rowVirtualizer.totalSize}px`, // PIXELS, NOT COUNT—NEEDED
            position: "relative", // NEEDED
            border: "5px solid green",
          }}
        >
          {rowVirtualizer.virtualItems.map(virtualRow => (
            <li
              key={virtualRow.index}
              style={{
                position: "absolute", // NEEDED
                top: 0, // NEEDED
                left: 0, // NEEDED
                height: `${virtualRow.size}px`, // NEEDED
                transform: `translateY(${virtualRow.start}px)`, // NEEDED
              }}
            >
              Row {virtualRow.index}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default VirtualTestApp
