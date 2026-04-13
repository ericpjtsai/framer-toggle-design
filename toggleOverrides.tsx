import { Override } from "framer"
import { useState, useEffect, useRef } from "react"

function useToggleSelection(): "left" | "right" {
    const [sel, setSel] = useState<"left" | "right">(
        () =>
            (typeof window !== "undefined" &&
                (window as any).__toggleSelection) ||
            "left"
    )
    useEffect(() => {
        const h = () => {
            const v = (window as any).__toggleSelection
            if (v === "left" || v === "right") setSel(v)
        }
        window.addEventListener("toggle-selection-change", h)
        return () => window.removeEventListener("toggle-selection-change", h)
    }, [])
    return sel
}

function useSectionVisibility(side: "left" | "right") {
    const selection = useToggleSelection()
    const active = selection === side
    const [render, setRender] = useState(active)
    const [show, setShow] = useState(active)
    const isMount = useRef(true)

    useEffect(() => {
        if (isMount.current) {
            isMount.current = false
            return
        }
        if (active) {
            const t = setTimeout(() => {
                setRender(true)
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => setShow(true))
                )
            }, 300)
            return () => clearTimeout(t)
        } else {
            setShow(false)
            const t = setTimeout(() => setRender(false), 300)
            return () => clearTimeout(t)
        }
    }, [active])

    return { active, render, show }
}

export function ShowWhenClientWork(): Override {
    const { active, render, show } = useSectionVisibility("left")
    if (!render) return { style: { display: "none" } }
    return {
        initial: false,
        animate: { opacity: show ? 1 : 0, scale: show ? 1 : 0.97 },
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
        style: {
            pointerEvents: active ? "auto" : "none",
            transformOrigin: "top center",
        },
    }
}

export function ShowWhenAiLab(): Override {
    const { active, render, show } = useSectionVisibility("right")
    if (!render) return { style: { display: "none" } }
    return {
        initial: false,
        animate: { opacity: show ? 1 : 0, scale: show ? 1 : 0.97 },
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
        style: {
            pointerEvents: active ? "auto" : "none",
            transformOrigin: "top center",
        },
    }
}
