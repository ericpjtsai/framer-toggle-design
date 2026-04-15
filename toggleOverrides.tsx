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

const transition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }

function useClientWorkVisibility() {
    const active = useToggleSelection() === "left"
    const [render, setRender] = useState(active)
    const [show, setShow] = useState(active)
    const isMount = useRef(true)

    useEffect(() => {
        if (isMount.current) {
            isMount.current = false
            return
        }
        if (active) {
            setRender(true)
            const t = setTimeout(() => setShow(true), 280)
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
    const { active, render, show } = useClientWorkVisibility()
    return {
        layout: true,
        initial: false,
        animate: {
            opacity: show ? 1 : 0,
            scale: show ? 1 : 0.97,
            y: show ? 0 : -8,
        },
        transition: show
            ? { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
            : transition,
        style: {
            display: render ? undefined : "none",
            pointerEvents: active ? "auto" : "none",
            transformOrigin: "top center",
        },
    }
}

export function ShowWhenAiLab(): Override {
    return {
        layout: true,
        transition,
        style: { transformOrigin: "top center" },
    }
}
