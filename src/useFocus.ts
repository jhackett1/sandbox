import {
  MutableRefObject,
  useEffect,
  // useState
} from "react"

/** track focus events within a container and return the focused DOM node if there is one, else return null */
const useFocus = (ref: MutableRefObject<HTMLElement>) =>
  // : HTMLElement | null
  {
    // const [focusedElement, setFocusedElement] = useState(null)

    const handleFocusChange = (e: FocusEvent) => {
      if (ref.current.contains(e.target as Node))
        console.log(
          `focused element ${e.target.toString()} is within container`
        )

      // console.log("coming into focus:", e.target)
      // setFocusedElement(e.target)
    }

    const handleFocusOut = (e: FocusEvent) => {
      // console.log("leaving focus:", e.target)
      // setFocusedElement(null)
    }

    useEffect(() => {
      const container = ref?.current

      container?.addEventListener("focusin", handleFocusChange)
      container?.addEventListener("focusout", handleFocusOut)

      return () => {
        container?.removeEventListener("focusin", handleFocusChange)
        container?.removeEventListener("focusout", handleFocusOut)
      }
    }, [ref])

    // return focusedElement
  }

export default useFocus
