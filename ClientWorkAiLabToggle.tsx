import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Selection = "left" | "right"
type Theme = "light" | "dark"

function toRgba(color: string, alpha: number): string {
    let r = 31
    let g = 58
    let b = 211
    const trimmed = color.trim()
    if (trimmed.startsWith("#")) {
        const hex = trimmed.slice(1)
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16)
            g = parseInt(hex[1] + hex[1], 16)
            b = parseInt(hex[2] + hex[2], 16)
        } else if (hex.length >= 6) {
            r = parseInt(hex.slice(0, 2), 16)
            g = parseInt(hex.slice(2, 4), 16)
            b = parseInt(hex.slice(4, 6), 16)
        }
    } else {
        const match = trimmed.match(/rgba?\(([^)]+)\)/)
        if (match) {
            const parts = match[1].split(",").map((s) => parseFloat(s.trim()))
            if (!Number.isNaN(parts[0])) r = parts[0]
            if (!Number.isNaN(parts[1])) g = parts[1]
            if (!Number.isNaN(parts[2])) b = parts[2]
        }
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface Props {
    leftLabel: string
    rightLabel: string
    leftLink: string
    rightLink: string
    openInNewTab: boolean
    interactiveLight: boolean
    defaultSelection: Selection
    theme: Theme
    fontSize: number
    fontFamily: string
    fontWeight: number
    letterSpacing: number
    activeTextColor: string
    inactiveTextColor: string
    shellTint: string
    haloColor: string
    leftAccentColor: string
    padding: number
    depth: number
    lightIntensity: number
    cornerRadius: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 372
 * @framerIntrinsicHeight 118
 */
export default function ClientWorkAiLabToggle(props: Props) {
    const {
        leftLabel,
        rightLabel,
        leftLink,
        rightLink,
        openInNewTab,
        interactiveLight,
        defaultSelection,
        theme,
        fontSize,
        fontFamily,
        fontWeight,
        letterSpacing,
        activeTextColor,
        inactiveTextColor,
        shellTint,
        haloColor,
        leftAccentColor,
        padding,
        depth,
        lightIntensity,
        cornerRadius,
        style,
    } = props

    const isDark = theme === "dark"

    const [selection, setSelection] = React.useState<Selection>(defaultSelection)
    const [isHovering, setIsHovering] = React.useState(false)
    const [lightPosition, setLightPosition] = React.useState({ x: 0.28, y: 0.22 })

    React.useEffect(() => {
        setSelection(defaultSelection)
    }, [defaultSelection])

    const glowStrength = 0.48 + lightIntensity * 0.95
    const shellPadding = padding
    const pillInsetX = padding
    const pillInsetTop = padding
    const pillInsetBottom = padding
    const softRadius = Math.max(cornerRadius, 24)
    const cavityRadius = softRadius - shellPadding / 2
    const pillRadius = Math.max(cavityRadius - 8, 24)

    // Auto-size the toggle based on fontSize, so changing the Size control
    // in Framer makes the whole switch grow or shrink proportionally. Ratios
    // tuned so the labels sit snug against the pill edges with a tighter
    // vertical margin — more button, less wasted whitespace around the text.
    const autoWidth = Math.round(fontSize * 15)
    const autoHeight = Math.round(fontSize * 3.5)

    // Dark theme has two visual states: matte (Client Work) and powered (AI Lab).
    const accented = isDark && selection === "right"

    const palette = isDark
        ? {
              // Portfolio palette: charcoal #272725 shell, cream #f5f0e8 plank,
              // olive #473c07 text. Shell color comes from the shellTint prop
              // so users can recolor the outer frame from the Framer panel;
              // a subtle white-to-black overlay preserves the soft highlight
              // at the top and darken at the bottom regardless of base color.
              shellBackground: `
                  linear-gradient(180deg,
                      rgba(255,255,255,0.08) 0%,
                      rgba(255,255,255,0) 45%,
                      rgba(0,0,0,0.28) 100%
                  ),
                  ${shellTint}
              `,
              shellShadow: `
                  0 ${8 + depth * 6}px ${20 + depth * 8}px rgba(0,0,0,0.38),
                  0 2px 4px rgba(0,0,0,0.28),
                  inset 0 1px 0 rgba(255,255,255,0.06),
                  inset 0 -1px 1px rgba(0,0,0,0.4)
              `,
              cavityBackground: `
                  linear-gradient(180deg,
                      rgba(46,46,44,1) 0%,
                      rgba(39,39,37,1) 55%,
                      rgba(31,31,29,1) 100%
                  )
              `,
              cavityShadow: "none",
              cavitySheen: `
                  linear-gradient(180deg,
                      rgba(0,0,0,0) 0%,
                      rgba(0,0,0,0) 100%
                  )
              `,
              cavityHoverGlow: `
                  radial-gradient(circle at ${lightPosition.x * 100}% ${lightPosition.y * 100}%,
                      rgba(245,240,232,${isHovering ? 0.05 : 0.02}) 0%,
                      rgba(245,240,232,0) 45%
                  )
              `,
              pillAura: "none",
              pillBackground: `
                  radial-gradient(ellipse 120% 140% at 50% 20%,
                      rgba(252,249,243,1) 0%,
                      rgba(248,244,237,1) 30%,
                      rgba(243,237,228,1) 65%,
                      rgba(228,220,206,1) 100%
                  )
              `,
              pillShadow: `
                  0 ${10 + depth * 6}px ${24 + depth * 10}px rgba(0,0,0,0.48),
                  0 ${4 + depth * 2}px ${8 + depth * 4}px rgba(0,0,0,0.34),
                  0 2px 4px rgba(0,0,0,0.24),
                  0 1px 1px rgba(0,0,0,0.18),
                  inset 0 2px 1px rgba(255,255,255,1),
                  inset 0 1px 3px rgba(255,255,255,0.7),
                  inset 0 -2px 1px rgba(71,60,7,0.18),
                  inset 0 -4px 8px rgba(71,60,7,0.14),
                  inset 3px 0 6px -1px rgba(255,255,255,0.35),
                  inset -3px 0 6px -1px rgba(71,60,7,0.12)
              `,
              pillSpecular: `
                  linear-gradient(180deg,
                      rgba(255,255,255,${0.25 + lightIntensity * 0.08}) 0%,
                      rgba(255,255,255,0.06) 40%,
                      rgba(255,255,255,0) 100%
                  )
              `,
              activeTextColor: "rgba(71,60,7,1)",
              inactiveTextColor: "rgba(71,60,7,0.35)",
              activeTextShadow: "none",
              inactiveTextShadow: "none",
          }
        : {
              shellBackground: `
                  linear-gradient(180deg,
                      rgba(255,255,255,1) 0%,
                      ${shellTint} 50%,
                      rgba(228,230,234,1) 100%
                  )
              `,
              shellShadow: `
                  0 ${10 + depth * 8}px ${22 + lightIntensity * 8}px rgba(24,28,35,0.08),
                  0 1px 2px rgba(0,0,0,0.04),
                  inset 0 1px 0 rgba(255,255,255,0.95),
                  inset 0 -8px 14px rgba(198,202,210,0.22)
              `,
              cavityBackground: `
                  linear-gradient(180deg,
                      rgba(232,234,238,1) 0%,
                      rgba(240,242,246,1) 60%,
                      rgba(245,246,249,1) 100%
                  )
              `,
              cavityShadow: `
                  inset 0 2px 4px rgba(24,28,35,0.12),
                  inset 0 1px 1px rgba(24,28,35,0.06),
                  inset 0 -1px 1px rgba(255,255,255,0.7)
              `,
              cavitySheen: `
                  linear-gradient(180deg,
                      rgba(255,255,255,0) 0%,
                      rgba(255,255,255,0) 100%
                  )
              `,
              cavityHoverGlow: `
                  radial-gradient(circle at ${lightPosition.x * 100}% ${lightPosition.y * 100}%,
                      rgba(255,255,255,${isHovering ? 0.35 : 0.18}) 0%,
                      rgba(255,255,255,0) 50%
                  )
              `,
              pillAura: "none",
              pillBackground: `
                  linear-gradient(180deg,
                      rgba(255,255,255,1) 0%,
                      rgba(252,253,254,1) 50%,
                      rgba(247,248,250,1) 100%
                  )
              `,
              pillShadow: `
                  0 ${6 + depth * 4}px ${14 + depth * 6}px rgba(24,28,35,0.1),
                  0 2px 4px rgba(24,28,35,0.06),
                  0 1px 1px rgba(24,28,35,0.04),
                  inset 0 1px 0 rgba(255,255,255,1),
                  inset 0 -1px 2px rgba(198,202,210,0.3)
              `,
              pillSpecular: `
                  linear-gradient(180deg,
                      rgba(255,255,255,${0.25 + lightIntensity * 0.1}) 0%,
                      rgba(255,255,255,0.05) 40%,
                      rgba(255,255,255,0) 100%
                  )
              `,
              activeTextColor,
              inactiveTextColor,
              activeTextShadow: "0 1px 0 rgba(255,255,255,0.8)",
              inactiveTextShadow: "0 1px 0 rgba(255,255,255,0.8)",
          }

    const resetLight = React.useCallback(() => {
        // Memorize the last light source angle on hover-out — don't snap back.
        setIsHovering(false)
    }, [])

    const updateLightFromEvent = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (!interactiveLight) return
            const bounds = event.currentTarget.getBoundingClientRect()
            if (bounds.width === 0 || bounds.height === 0) return
            const nextX = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1)
            const nextY = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1)
            setLightPosition({ x: nextX, y: nextY })
        },
        [interactiveLight]
    )

    const handlePointerMove = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            setIsHovering(true)
            updateLightFromEvent(event)
        },
        [updateLightFromEvent]
    )

    const handlePointerEnter = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            setIsHovering(true)
            // Sync immediately so the memorized angle resets to the new entry point
            // even before the first pointer-move fires.
            updateLightFromEvent(event)
        },
        [updateLightFromEvent]
    )

    const navigateTo = React.useCallback(
        (href: string) => {
            if (!href || typeof window === "undefined") return

            window.setTimeout(() => {
                if (openInNewTab) {
                    window.open(href, "_blank", "noopener,noreferrer")
                } else {
                    window.location.assign(href)
                }
            }, 170)
        },
        [openInNewTab]
    )

    const handleSelect = React.useCallback(
        (next: Selection) => {
            setSelection(next)

            if (next === "left") {
                navigateTo(leftLink)
            } else {
                navigateTo(rightLink)
            }
        },
        [leftLink, navigateTo, rightLink]
    )

    // V-hinged flip switch in 3D: two halves pivot around the shared center
    // line. The selected half stays flat at the cavity floor; the other half
    // hinges FORWARD (out of the screen) via rotateY, so the raised edge
    // pops toward the viewer like a real rocker cap.
    const tiltAngle = 18
    const leftHalfTransform =
        selection === "right"
            ? `rotateY(${tiltAngle}deg)`
            : "rotateY(0deg)"
    const rightHalfTransform =
        selection === "left"
            ? `rotateY(${-tiltAngle}deg)`
            : "rotateY(0deg)"

    const hitAreaStyle: React.CSSProperties = {
        width: "50%",
        height: "100%",
        border: "none",
        background: "transparent",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        appearance: "none",
    }

    return (
        <div
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={resetLight}
            style={{
                ...style,
                width: autoWidth,
                height: autoHeight,
                position: "relative",
                overflow: "visible",
                transform: isHovering && interactiveLight ? "translateY(-1px)" : "translateY(0px)",
                transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
        >
                <style>{`
                    @keyframes cwAiToggleBreathe {
                        0%, 100% { opacity: 0.55; }
                        50% { opacity: 1; }
                    }
                `}</style>

                {accented && (
                    <div
                        style={{
                            position: "absolute",
                            top: shellPadding + pillInsetTop,
                            bottom: shellPadding + pillInsetBottom,
                            left: shellPadding + pillInsetX,
                            right: shellPadding + pillInsetX,
                            borderRadius: pillRadius,
                            boxShadow: `
                                0 0 0 2px ${toRgba(haloColor, 0.9)},
                                0 0 14px 4px ${toRgba(haloColor, 0.85)},
                                0 0 32px 10px ${toRgba(haloColor, 0.6)},
                                0 0 68px 22px ${toRgba(haloColor, 0.38)},
                                0 0 128px 40px ${toRgba(haloColor, 0.2)}
                            `,
                            animation: "cwAiToggleBreathe 3.4s ease-in-out infinite",
                            pointerEvents: "none",
                            zIndex: 6,
                        }}
                    />
                )}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: softRadius,
                        background: palette.shellBackground,
                        boxShadow: palette.shellShadow,
                        transition: "box-shadow 220ms ease, background 220ms ease",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        inset: shellPadding,
                        borderRadius: cavityRadius,
                        overflow: "visible",
                        background: palette.cavityBackground,
                        boxShadow: palette.cavityShadow,
                        transition: "box-shadow 220ms ease, background 220ms ease",
                    }}
                >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: cavityRadius,
                        background: palette.cavitySheen,
                        pointerEvents: "none",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: cavityRadius,
                        background: palette.cavityHoverGlow,
                        pointerEvents: "none",
                        transition: "background 220ms ease",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: pillInsetTop,
                        bottom: pillInsetBottom,
                        left: pillInsetX,
                        right: pillInsetX,
                        perspective: 900,
                        transformStyle: "preserve-3d",
                        pointerEvents: "none",
                        zIndex: 2,
                    }}
                >
                    {/* Left half — wrapper rotates, contains base + top face */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            width: "50%",
                            borderRadius: `${pillRadius}px 0 0 ${pillRadius}px`,
                            transformOrigin: "100% 50%",
                            transform: leftHalfTransform,
                            transformStyle: "preserve-3d",
                            transition:
                                "transform 520ms cubic-bezier(0.34, 1.35, 0.64, 1)",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: -2,
                                right: 0,
                                borderRadius: `${pillRadius}px 0 0 ${pillRadius}px`,
                                background:
                                    "linear-gradient(180deg, rgba(86,70,18,1) 0%, rgba(52,43,10,1) 45%, rgba(24,20,4,1) 100%)",
                                boxShadow:
                                    "inset 0 -1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,120,0.12)",
                                transform: "translateZ(-8px)",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "inherit",
                                background: palette.pillBackground,
                                boxShadow: palette.pillShadow,
                                transform: "translateZ(0px)",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily,
                                fontSize,
                                fontWeight,
                                letterSpacing: `${letterSpacing}em`,
                                lineHeight: 1,
                                whiteSpace: "nowrap",
                                transition:
                                    "box-shadow 220ms ease, background 220ms ease, color 220ms ease",
                                color:
                                    selection === "left"
                                        ? leftAccentColor
                                        : palette.activeTextColor,
                                textShadow: palette.activeTextShadow,
                            }}
                        >
                            {leftLabel}
                            <div
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    bottom: Math.max(fontSize * 0.35, 4),
                                    width: Math.max(
                                        Math.round(fontSize * 0.28),
                                        4
                                    ),
                                    height: Math.max(
                                        Math.round(fontSize * 0.28),
                                        4
                                    ),
                                    borderRadius: "50%",
                                    background: leftAccentColor,
                                    transform: "translateX(-50%)",
                                    opacity: selection === "left" ? 1 : 0,
                                    transition:
                                        "opacity 220ms ease, background 220ms ease",
                                    pointerEvents: "none",
                                }}
                            />
                        </div>
                    </div>

                    {/* Right half — wrapper rotates, contains base + top face */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            right: 0,
                            width: "50%",
                            borderRadius: `0 ${pillRadius}px ${pillRadius}px 0`,
                            transformOrigin: "0% 50%",
                            transform: rightHalfTransform,
                            transformStyle: "preserve-3d",
                            transition:
                                "transform 520ms cubic-bezier(0.34, 1.35, 0.64, 1)",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: -2,
                                borderRadius: `0 ${pillRadius}px ${pillRadius}px 0`,
                                background:
                                    "linear-gradient(180deg, rgba(86,70,18,1) 0%, rgba(52,43,10,1) 45%, rgba(24,20,4,1) 100%)",
                                boxShadow:
                                    "inset 0 -1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,120,0.12)",
                                transform: "translateZ(-8px)",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "inherit",
                                background: palette.pillBackground,
                                boxShadow: palette.pillShadow,
                                transform: "translateZ(0px)",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily,
                                fontSize,
                                fontWeight,
                                letterSpacing: `${letterSpacing}em`,
                                lineHeight: 1,
                                whiteSpace: "nowrap",
                                transition:
                                    "box-shadow 220ms ease, background 220ms ease, color 220ms ease",
                                color:
                                    selection === "right"
                                        ? haloColor
                                        : palette.activeTextColor,
                                textShadow: palette.activeTextShadow,
                            }}
                        >
                            {rightLabel}
                            <div
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    bottom: Math.max(fontSize * 0.35, 4),
                                    width: Math.max(
                                        Math.round(fontSize * 0.28),
                                        4
                                    ),
                                    height: Math.max(
                                        Math.round(fontSize * 0.28),
                                        4
                                    ),
                                    borderRadius: "50%",
                                    background: haloColor,
                                    transform: "translateX(-50%)",
                                    opacity: selection === "right" ? 1 : 0,
                                    transition:
                                        "opacity 220ms ease, background 220ms ease",
                                    pointerEvents: "none",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div
                    role="tablist"
                    aria-label={`${leftLabel} or ${rightLabel}`}
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 5,
                        display: "flex",
                    }}
                >
                    <button
                        type="button"
                        role="tab"
                        aria-label={leftLabel}
                        aria-selected={selection === "left"}
                        onClick={() => handleSelect("left")}
                        style={hitAreaStyle}
                    />
                    <button
                        type="button"
                        role="tab"
                        aria-label={rightLabel}
                        aria-selected={selection === "right"}
                        onClick={() => handleSelect("right")}
                        style={hitAreaStyle}
                    />
                </div>
            </div>
        </div>
    )
}

ClientWorkAiLabToggle.defaultProps = {
    leftLabel: "Client Work",
    rightLabel: "AI Lab",
    leftLink: "",
    rightLink: "",
    openInNewTab: false,
    interactiveLight: true,
    defaultSelection: "left",
    theme: "dark",
    fontSize: 18,
    fontFamily: "Tiempos, ui-serif, Georgia, serif",
    fontWeight: 500,
    letterSpacing: -0.04,
    activeTextColor: "rgb(71, 60, 7)",
    inactiveTextColor: "rgba(71, 60, 7, 0.35)",
    shellTint: "rgb(39, 39, 37)",
    haloColor: "rgb(10, 132, 255)",
    leftAccentColor: "rgb(253, 87, 0)",
    padding: 6,
    depth: 0.68,
    lightIntensity: 0.42,
    cornerRadius: 999,
}

addPropertyControls(ClientWorkAiLabToggle, {
    leftLabel: {
        type: ControlType.String,
        title: "Left",
    },
    rightLabel: {
        type: ControlType.String,
        title: "Right",
    },
    leftLink: {
        type: ControlType.String,
        title: "Left URL",
    },
    rightLink: {
        type: ControlType.String,
        title: "Right URL",
    },
    openInNewTab: {
        type: ControlType.Boolean,
        title: "New Tab",
        enabledTitle: "Yes",
        disabledTitle: "No",
    },
    interactiveLight: {
        type: ControlType.Boolean,
        title: "Light FX",
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    defaultSelection: {
        type: ControlType.Enum,
        title: "Default",
        options: ["left", "right"],
        optionTitles: ["Left", "Right"],
    },
    theme: {
        type: ControlType.Enum,
        title: "Theme",
        options: ["light", "dark"],
        optionTitles: ["Light", "Dark"],
    },
    fontSize: {
        type: ControlType.Number,
        title: "Size",
        min: 14,
        max: 52,
        unit: "px",
        displayStepper: true,
    },
    fontFamily: {
        type: ControlType.Font,
        title: "Font",
    },
    fontWeight: {
        type: ControlType.Number,
        title: "Weight",
        min: 100,
        max: 900,
        step: 100,
        displayStepper: true,
    },
    letterSpacing: {
        type: ControlType.Number,
        title: "Tracking",
        min: -0.15,
        max: 0.25,
        step: 0.01,
        unit: "em",
        displayStepper: true,
    },
    activeTextColor: {
        type: ControlType.Color,
        title: "Active",
    },
    inactiveTextColor: {
        type: ControlType.Color,
        title: "Inactive",
    },
    shellTint: {
        type: ControlType.Color,
        title: "Shell",
    },
    haloColor: {
        type: ControlType.Color,
        title: "Right Lit / Halo",
    },
    leftAccentColor: {
        type: ControlType.Color,
        title: "Left Lit",
    },
    padding: {
        type: ControlType.Number,
        title: "Padding",
        min: 0,
        max: 40,
        unit: "px",
        displayStepper: true,
    },
    depth: {
        type: ControlType.Number,
        title: "Depth",
        min: 0,
        max: 1,
        step: 0.05,
        displayStepper: true,
    },
    lightIntensity: {
        type: ControlType.Number,
        title: "Light",
        min: 0,
        max: 1,
        step: 0.05,
        displayStepper: true,
    },
    cornerRadius: {
        type: ControlType.Number,
        title: "Radius",
        min: 24,
        max: 999,
        unit: "px",
        displayStepper: true,
    },
})
