import "./style.scss"
import { useCallback, useEffect, useRef, useState } from "react"
// @ts-ignore
import { data } from "./data.ts"
import { useVirtual } from "react-virtual"

const Cell = ({ row, col, i, j, editing, setEditing, trRef }) => {
  const [fakeValue, setFakeValue] = useState<string>(row[col])

  const tdRef = useRef<HTMLTableCellElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const goLeft = () =>
        (trRef?.current?.children?.[j - 1] || tdRef?.current).focus()
      const goRight = () =>
        (trRef?.current?.children?.[j + 1] || tdRef?.current).focus()
      const goUp = () =>
        (
          trRef?.current?.previousSibling?.children?.[j] ?? tdRef.current
        ).focus()
      const goDown = () =>
        (trRef?.current?.nextSibling?.children?.[j] ?? tdRef?.current).focus()

      switch (e.key) {
        case "Enter":
          if (editing) {
            setEditing(null)
            if (e.shiftKey) {
              goUp()
            } else {
              goDown()
            }
          } else {
            setEditing([i, j])
          }
          break
        case "Escape":
          if (editing) {
            setEditing(null)
            setFakeValue(row[col])
            tdRef.current.focus()
          }
          break
        case "Tab":
          setEditing(null)
          break
        case "ArrowUp":
          e.preventDefault() // prevent default scrolling behaviour
          goUp()
          break
        case "ArrowDown":
          e.preventDefault()
          goDown()
          break
        case "ArrowLeft":
          e.preventDefault()
          goLeft()
          break
        case "ArrowRight":
          e.preventDefault()
          goRight()
          break
      }
    },
    [editing, setEditing, i, j, col, row, trRef]
  )

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
        case "Enter":
          // handled elsewhere
          break
        default:
          if (!editing) {
            setEditing([i, j])
            setFakeValue(e.key)
          }
          break
      }
    },
    [editing, setEditing, i, j, setFakeValue]
  )

  const handleDoubleClick = e => setEditing([i, j])

  useEffect(() => {
    const td = tdRef?.current

    td.addEventListener("keydown", handleKeyUp)
    td.addEventListener("keypress", handleKeyPress)
    return () => {
      td?.removeEventListener("keydown", handleKeyUp)
      td.removeEventListener("keypress", handleKeyPress)
    }
  }, [handleKeyUp, handleKeyPress])

  useEffect(() => inputRef?.current?.focus(), [editing]) // bring focus to input on render

  return (
    <td
      tabIndex={0}
      ref={tdRef}
      aria-live="polite"
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={fakeValue}
          onChange={e => setFakeValue(e.target.value)}
        />
      ) : (
        <div>{fakeValue}</div>
      )}
    </td>
  )
}

const Row = ({ cols, row, i, editing, setEditing, style }) => {
  const trRef = useRef<HTMLTableRowElement | null>(null)

  return (
    <tr ref={trRef} style={style}>
      {cols.map((col, j) => (
        <Cell
          key={`${i}-${j}`}
          row={row}
          col={col}
          editing={editing?.[0] === i && editing?.[1] === j}
          setEditing={setEditing}
          i={i}
          j={j}
          trRef={trRef}
        />
      ))}
    </tr>
  )
}

const Table = ({ cols, rows }) => {
  const [editing, setEditing] = useState<[number, number] | null>(null)

  const tableRef = useRef<HTMLTableElement | null>(null)
  // const tbodyRef = useRef<HTMLTableSectionElement | null>(null)

  const handleClick = e => {
    if (!tableRef.current.contains(e.target)) setEditing(null)
  }

  useEffect(() => {
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  const { virtualItems, totalSize } = useVirtual({
    size: rows.length,
    parentRef: tableRef,
  })

  return (
    <>
      <dl>
        <dt>Rendering </dt>
        <dd>
          {virtualItems.length} rows of {rows.length}
        </dd>
        <dt>Focused element</dt>
        <dd>{document.activeElement.outerHTML.slice(0, 300)}</dd>
        <dt>Cell being edited</dt>
        <dd>{JSON.stringify(editing)}</dd>
      </dl>

      <button>example focusable element</button>

      <table ref={tableRef}>
        <thead>
          <tr>
            {cols.map(col => (
              <th scope="col" key={col}>
                <div>{col}</div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody
          style={{
            height: `${totalSize}px`,
          }}
        >
          {virtualItems.map((vItem, i) => (
            <Row
              key={vItem.index}
              i={i}
              editing={editing}
              setEditing={setEditing}
              cols={cols}
              row={rows[i]}
              style={{
                height: `${vItem.size}px`, // NEEDED
                transform: `translateY(${vItem.start}px)`, // NEEDED
              }}
            />
          ))}
        </tbody>
      </table>

      <button>example focusable element</button>
    </>
  )
}

const App = () => (
  <Table cols={Object.keys(data[0])} rows={data.slice(0, 1000)} />
)

export default App
