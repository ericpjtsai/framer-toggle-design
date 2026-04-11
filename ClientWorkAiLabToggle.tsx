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
    activeTextColor: string
    inactiveTextColor: string
    shellTint: string
    haloColor: string
    padding: number
    depth: number
    lightIntensity: number
    cornerRadius: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight fixed
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
        activeTextColor,
        inactiveTextColor,
        shellTint,
        haloColor,
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

    const depthStrength = 0.72 + depth * 0.78
    const glowStrength = 0.48 + lightIntensity * 0.95
    const shellPadding = padding
    const pillInsetX = padding
    const pillInsetTop = padding
    const pillInsetBottom = padding
    const softRadius = Math.max(cornerRadius, 24)
    const cavityRadius = softRadius - shellPadding / 2
    const pillRadius = Math.max(cavityRadius - 8, 24)
    const outerW = typeof style?.width === "number" ? style.width : 372
    const outerH = typeof style?.height === "number" ? style.height : 118
    const pillBoxW = Math.max((outerW - 2 * padding) / 2 - 10, 1)
    const pillBoxH = Math.max(outerH - 4 * padding, 1)
    const ambientX = (lightPosition.x - 0.5) * 24 * glowStrength
    const ambientY = 16 + lightPosition.y * 18 * depthStrength
    const shellLightX = 14 + lightPosition.x * 58
    const shellLightY = 8 + lightPosition.y * 30
    const cavityLightX = 16 + lightPosition.x * 66
    const cavityLightY = 14 + lightPosition.y * 30
    const pillLightX = 22 + lightPosition.x * 26
    const pillLightY = 12 + lightPosition.y * 10
    const activeLabel = selection === "left" ? leftLabel : rightLabel
    const figmaTrackScale = 0.76 + depth * 0.18
    const figmaPillScale = 0.7 + depth * 0.18
    const accentDirection = selection === "right" ? 1 : -1
    const accentHardInsetX = 1.1 * figmaPillScale * accentDirection
    const accentSoftInsetX = 2.1 * figmaPillScale * accentDirection
    const accentDropX = 6.5 * figmaPillScale * accentDirection

    // Dark theme has two visual states: matte (Client Work) and powered (AI Lab).
    const accented = isDark && selection === "right"

    const palette = isDark
        ? {
              shellBackground: `
                  linear-gradient(248deg,
                      rgba(23,23,23,1) 45%,
                      rgba(23,23,23,1) 47%,
                      rgba(39,39,39,0.51) 98%
                  )
              `,
              shellShadow: accented
                  ? `
                      0 -11px 28px 4px rgba(15,15,15,1),
                      -6px 13px 26px 0 rgba(42,42,44,1),
                      0 0 70px 6px ${toRgba(haloColor, 0.42)},
                      0 0 140px 18px ${toRgba(haloColor, 0.18)},
                      inset -1px 59px 21px 0 rgba(0,0,0,0.2),
                      inset 0 18px 7px 0 rgba(23,23,23,1)
                  `
                  : `
                      0 -11px 28px 4px rgba(15,15,15,1),
                      -6px 13px 26px 0 rgba(42,42,44,1),
                      inset -1px 59px 21px 0 rgba(0,0,0,0.2),
                      inset 0 18px 7px 0 rgba(23,23,23,1)
                  `,
              cavityBackground: `
                  radial-gradient(circle at ${lightPosition.x * 100}% ${lightPosition.y * 100}%,
                      rgba(255,255,255,${0.06 * glowStrength}) 0%,
                      rgba(255,255,255,${0.02 * glowStrength}) 22%,
                      rgba(255,255,255,0) 48%
                  ),
                  linear-gradient(180deg,
                      rgba(20,22,24,1) 0%,
                      rgba(13,13,13,1) 100%
                  )
              `,
              cavityShadow: `
                  inset 0 2px 5px rgba(0,0,0,0.95),
                  inset 0 -1px 0 rgba(255,255,255,0.04),
                  inset 0 -14px 22px rgba(0,0,0,0.6),
                  inset 16px 0 22px rgba(0,0,0,0.35),
                  inset -16px 0 22px rgba(0,0,0,0.35)
              `,
              cavitySheen: `
                  linear-gradient(180deg,
                      rgba(255,255,255,0.04) 0%,
                      rgba(255,255,255,0) 30%
                  )
              `,
              cavityHoverGlow: accented
                  ? `
                      radial-gradient(circle at ${lightPosition.x * 100}% ${lightPosition.y * 100}%,
                          ${toRgba(haloColor, isHovering ? 0.22 : 0.14)} 0%,
                          ${toRgba(haloColor, 0)} 50%
                      )
                  `
                  : `
                      radial-gradient(circle at ${lightPosition.x * 100}% ${lightPosition.y * 100}%,
                          rgba(255,255,255,${isHovering ? 0.06 : 0.03}) 0%,
                          rgba(255,255,255,0) 40%
                      )
                  `,
              pillAura: "none",
              pillBackground: `
                  radial-gradient(circle at ${lightPosition.x * 100}% ${lightPosition.y * 100}%,
                      rgba(255,255,255,${0.18 + lightIntensity * 0.1}) 0%,
                      rgba(255,255,255,${0.06 + lightIntensity * 0.04}) 26%,
                      rgba(255,255,255,0) 56%
                  ),
                  linear-gradient(180deg,
                      rgba(34,36,38,1) 0%,
                      rgba(20,22,24,1) 100%
                  )
              `,
              pillShadow: accented
                  ? `
                      inset 4px 0 0 0 ${toRgba(haloColor, 0.92)},
                      inset 7px 0 12px 0 ${toRgba(haloColor, 0.44)},
                      inset -2px 11px 9px 4px rgba(255,255,255,0.12),
                      inset -3px -9px 10px 0 rgba(0,0,0,0.75),
                      inset 0 -30px 26px 0 rgba(0,0,0,0.37),
                      inset -13px 14px 24px 0 rgba(255,255,255,0.25),
                      -10px 15px 24px 21px rgba(0,0,0,0.46),
                      26px 28px 58px 36px rgba(0,0,0,0.25),
                      2px 20px 12px 0 rgba(0,0,0,0.68),
                      2px 25px 12px 0 rgba(0,0,0,0.48)
                  `
                  : `
                      inset -2px 11px 14px -1px rgba(255,255,255,0.18),
                      inset -3px -9px 10px 0 rgba(0,0,0,0.75),
                      inset 0 -30px 26px 0 rgba(0,0,0,0.37),
                      inset -13px 14px 28px 0 rgba(255,255,255,0.08),
                      -10px 15px 24px 21px rgba(0,0,0,0.46),
                      2px 20px 12px 0 rgba(0,0,0,0.68),
                      2px 23px 24px 0 rgba(0,0,0,0.03)
                  `,
              pillSpecular: `
                  linear-gradient(118deg,
                      rgba(255,255,255,0) 22%,
                      rgba(255,255,255,${0.10 + lightIntensity * 0.04}) 38%,
                      rgba(255,255,255,0.04) 50%,
                      rgba(255,255,255,0) 66%
                  )
              `,
              activeTextColor: accented
                  ? "rgba(245,250,255,1)"
                  : "rgba(180,184,194,0.85)",
              inactiveTextColor: accented
                  ? "rgba(170,195,255,0.65)"
                  : "rgba(100,108,122,0.5)",
              activeTextShadow: accented
                  ? `0 0 14px ${toRgba(haloColor, 0.55)}, 0 0 2px rgba(255,255,255,0.7), 0 1px 0 rgba(0,0,0,0.6)`
                  : "0 1px 0 rgba(0,0,0,0.6)",
              inactiveTextShadow: "0 1px 0 rgba(0,0,0,0.6)",
          }
        : {
              shellBackground: `
                  linear-gradient(180deg,
                      rgba(255,255,255,0.98) 0%,
                      ${shellTint} 34%,
                      rgba(221,225,232,1) 72%,
                      rgba(191,196,205,1) 100%
                  )
              `,
              shellShadow: `
                  0 ${12 + depth * 10}px ${26 + lightIntensity * 10}px rgba(24,28,35,0.12),
                  0 2px 6px rgba(255,255,255,0.7),
                  inset 0 2px 1px rgba(255,255,255,1),
                  inset 0 -10px 16px rgba(133,140,151,0.18),
                  inset 0 16px 20px rgba(255,255,255,0.34)
              `,
              cavityBackground: `
                  radial-gradient(circle at ${cavityLightX}% ${cavityLightY}%,
                      rgba(255,255,255,${0.08 * glowStrength}) 0%,
                      rgba(255,255,255,${0.02 * glowStrength}) 18%,
                      rgba(255,255,255,0) 34%
                  ),
                  radial-gradient(circle at ${cavityLightX + 18}% ${cavityLightY + 12}%,
                      rgba(255,255,255,${0.03 * glowStrength}) 0%,
                      rgba(255,255,255,0) 26%
                  ),
                  radial-gradient(circle at 72% 50%,
                      rgba(0,0,0,0.42) 0%,
                      rgba(0,0,0,0.14) 28%,
                      rgba(0,0,0,0) 52%
                  ),
                  linear-gradient(180deg,
                      rgba(56,58,63,0.98) 0%,
                      rgba(31,33,37,1) 24%,
                      rgba(18,19,23,1) 58%,
                      rgba(33,35,40,0.98) 100%
                  )
              `,
              cavityShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.08),
                  inset 0 10px 14px rgba(255,255,255,0.04),
                  inset 0 -18px 28px rgba(0,0,0,0.34),
                  inset 16px 0 22px rgba(255,255,255,0.02),
                  inset -20px 0 28px rgba(0,0,0,0.18)
              `,
              cavitySheen: `
                  linear-gradient(180deg,
                      rgba(255,255,255,0.18) 0%,
                      rgba(255,255,255,0.02) 20%,
                      rgba(255,255,255,0) 54%
                  )
              `,
              cavityHoverGlow: `
                  radial-gradient(circle at ${cavityLightX - 4}% ${cavityLightY - 6}%,
                      rgba(255,255,255,${isHovering ? 0.14 * glowStrength : 0.08 * glowStrength}) 0%,
                      rgba(255,255,255,0) 34%
                  )
              `,
              pillAura: `
                  radial-gradient(circle at ${pillLightX}% ${pillLightY}%,
                      rgba(255,255,255,0.78) 0%,
                      rgba(255,255,255,0.18) 28%,
                      rgba(255,255,255,0) 54%
                  ),
                  radial-gradient(circle at 34% 16%,
                      rgba(255,255,255,0.42) 0%,
                      rgba(255,255,255,0) 34%
                  ),
                  radial-gradient(circle at 50% 110%,
                      rgba(90,95,107,0.24) 0%,
                      rgba(90,95,107,0) 45%
                  )
              `,
              pillBackground: `
                  radial-gradient(circle at ${pillLightX}% ${pillLightY}%,
                      rgba(255,255,255,1) 0%,
                      rgba(255,255,255,0.94) 18%,
                      rgba(255,255,255,0.26) 38%,
                      rgba(255,255,255,0) 62%
                  ),
                  radial-gradient(circle at 26% 14%,
                      rgba(255,255,255,0.82) 0%,
                      rgba(255,255,255,0.34) 18%,
                      rgba(255,255,255,0) 44%
                  ),
                  radial-gradient(circle at 68% 82%,
                      rgba(191,198,210,0.14) 0%,
                      rgba(191,198,210,0) 44%
                  ),
                  linear-gradient(180deg,
                      rgba(255,255,255,1) 0%,
                      rgba(249,250,252,1) 34%,
                      rgba(242,244,247,1) 64%,
                      rgba(232,236,241,1) 100%
                  )
              `,
              pillShadow: `
                  ${accentHardInsetX}px 0 0 rgba(215,220,228,0.58) inset,
                  ${accentSoftInsetX}px 0 ${4.2 * figmaPillScale}px rgba(215,220,228,0.3) inset,
                  ${-3.2 * figmaPillScale}px ${5.4 * figmaPillScale}px ${8.8 * figmaPillScale}px ${5.8 * figmaPillScale}px rgba(0,0,0,0.22),
                  ${-0.82 * figmaPillScale}px ${4.5 * figmaPillScale}px ${3.69 * figmaPillScale}px ${1.64 * figmaPillScale}px rgba(255,255,255,0.12) inset,
                  ${-1.23 * figmaPillScale}px ${-3.68 * figmaPillScale}px ${4.09 * figmaPillScale}px rgba(0,0,0,0.3) inset,
                  0 ${-9.2 * figmaPillScale}px ${8.2 * figmaPillScale}px rgba(0,0,0,0.08) inset,
                  ${-4.4 * figmaPillScale}px ${4.8 * figmaPillScale}px ${8.2 * figmaPillScale}px rgba(255,255,255,0.18) inset,
                  ${accentDropX}px ${9.4 * figmaPillScale}px ${18 * figmaPillScale}px ${8 * figmaPillScale}px rgba(0,0,0,0.14),
                  ${0.82 * figmaPillScale}px ${7.2 * figmaPillScale}px ${4.2 * figmaPillScale}px rgba(0,0,0,0.18),
                  ${ambientX * 0.12}px ${8 + lightPosition.y * 4}px ${10 + lightIntensity * 5}px rgba(154,161,173,0.12)
              `,
              pillSpecular: `
                  linear-gradient(118deg,
                      rgba(255,255,255,0) 18%,
                      rgba(255,255,255,${0.34 + lightIntensity * 0.08}) 34%,
                      rgba(255,255,255,0.14) 46%,
                      rgba(255,255,255,0.04) 56%,
                      rgba(255,255,255,0) 66%
                  )
              `,
              activeTextColor,
              inactiveTextColor,
              activeTextShadow:
                  "0 1px 0 rgba(255,255,255,0.8), 0 10px 18px rgba(0,0,0,0.06)",
              inactiveTextShadow:
                  "0 1px 0 rgba(255,255,255,0.06), 0 8px 18px rgba(0,0,0,0.28)",
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

    const sliderTransform =
        selection === "left"
            ? `translateX(0%) translateY(${isHovering ? -1 : 0}px)`
            : `translateX(100%) translateY(${isHovering ? -1 : 0}px)`

    const labelBaseStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
        height: "100%",
        fontFamily,
        fontSize,
        fontWeight,
        letterSpacing: "-0.06em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        userSelect: "none",
    }

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
                width: style?.width ?? 372,
                height: style?.height ?? 118,
                position: "relative",
                overflow: "visible",
                transform: isHovering && interactiveLight ? "translateY(-1px)" : "translateY(0px)",
                transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
        >
                <style>{`
                    @keyframes cwAiToggleSweep {
                        0% { transform: translateX(-120%); }
                        100% { transform: translateX(220%); }
                    }
                    @keyframes cwAiToggleChase {
                        to { stroke-dashoffset: -100; }
                    }
                    @keyframes cwAiToggleBreathe {
                        0%, 100% { opacity: 0.55; }
                        50% { opacity: 1; }
                    }
                `}</style>
                {isDark && (
                    <div
                        style={{
                            position: "absolute",
                            top: pillInsetTop + shellPadding,
                            bottom: pillInsetBottom + shellPadding,
                            left: pillInsetX + shellPadding,
                            width: `calc(50% - ${10 + shellPadding}px)`,
                            borderRadius: pillRadius,
                            transform: sliderTransform,
                            boxShadow: `
                                0 0 0 2px ${toRgba(haloColor, 0.75)},
                                0 0 24px 6px ${toRgba(haloColor, 0.6)},
                                0 0 60px 16px ${toRgba(haloColor, 0.4)},
                                0 0 120px 28px ${toRgba(haloColor, 0.22)}
                            `,
                            opacity: accented ? 1 : 0,
                            animation: accented
                                ? "cwAiToggleBreathe 3.4s ease-in-out infinite"
                                : undefined,
                            pointerEvents: "none",
                            zIndex: 6,
                            transition:
                                "transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease",
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
                        overflow: "hidden",
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

                {accented && (
                    <svg
                        width={pillBoxW}
                        height={pillBoxH}
                        viewBox={`0 0 ${pillBoxW} ${pillBoxH}`}
                        style={{
                            position: "absolute",
                            top: pillInsetTop,
                            left: pillInsetX,
                            width: pillBoxW,
                            height: pillBoxH,
                            transform: sliderTransform,
                            overflow: "visible",
                            pointerEvents: "none",
                            zIndex: 1,
                            transition:
                                "transform 460ms cubic-bezier(0.22, 1, 0.36, 1)",
                            animation:
                                "cwAiToggleBreathe 3.4s ease-in-out infinite",
                        }}
                    >
                        <rect
                            x={0}
                            y={0}
                            width={pillBoxW}
                            height={pillBoxH}
                            rx={Math.min(pillRadius, pillBoxH / 2)}
                            ry={Math.min(pillRadius, pillBoxH / 2)}
                            fill="none"
                            stroke={haloColor}
                            strokeWidth={6}
                            strokeLinecap="round"
                            pathLength={100}
                            strokeDasharray="22 78"
                            strokeDashoffset={0}
                            style={{
                                animation:
                                    "cwAiToggleChase 4.5s linear infinite",
                                filter: `drop-shadow(0 0 6px ${haloColor}) drop-shadow(0 0 14px ${toRgba(haloColor, 0.7)})`,
                            }}
                        />
                    </svg>
                )}

                {palette.pillAura !== "none" && (
                    <div
                        style={{
                            position: "absolute",
                            top: pillInsetTop + 12,
                            bottom: pillInsetBottom + 2,
                            left: pillInsetX + 8,
                            width: "calc(50% - 10px)",
                            transform: sliderTransform,
                            borderRadius: pillRadius,
                            background: palette.pillAura,
                            filter: "blur(15px)",
                            opacity: 0.88,
                            pointerEvents: "none",
                            zIndex: 1,
                            transition: "transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease",
                        }}
                    />
                )}

                <div
                    style={{
                        position: "absolute",
                        top: pillInsetTop,
                        bottom: pillInsetBottom,
                        left: pillInsetX,
                        width: "calc(50% - 10px)",
                        borderRadius: pillRadius,
                        transform: sliderTransform,
                        background: palette.pillBackground,
                        boxShadow: palette.pillShadow,
                        zIndex: 2,
                        transition:
                            "transform 460ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms ease, background 220ms ease",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: pillInsetTop,
                        bottom: pillInsetBottom,
                        left: pillInsetX,
                        width: "calc(50% - 10px)",
                        borderRadius: pillRadius,
                        transform: sliderTransform,
                        background: palette.pillSpecular,
                        mixBlendMode: "screen",
                        opacity: interactiveLight ? 1 : 0.82,
                        pointerEvents: "none",
                        zIndex: 3,
                        transition:
                            "transform 460ms cubic-bezier(0.22, 1, 0.36, 1), background 220ms ease, opacity 220ms ease",
                    }}
                />

                {accented && (
                    <div
                        style={{
                            position: "absolute",
                            top: pillInsetTop,
                            bottom: pillInsetBottom,
                            left: pillInsetX,
                            width: "calc(50% - 10px)",
                            borderRadius: pillRadius,
                            transform: sliderTransform,
                            overflow: "hidden",
                            pointerEvents: "none",
                            zIndex: 3,
                            mixBlendMode: "screen",
                            transition:
                                "transform 460ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: 0,
                                width: "55%",
                                background: `linear-gradient(105deg,
                                    rgba(255,255,255,0) 0%,
                                    rgba(255,255,255,0.08) 38%,
                                    ${toRgba(haloColor, 0.55)} 50%,
                                    rgba(255,255,255,0.08) 62%,
                                    rgba(255,255,255,0) 100%)`,
                                animation: "cwAiToggleSweep 4.2s linear infinite",
                            }}
                        />
                    </div>
                )}

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                        display: "flex",
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            ...labelBaseStyle,
                            color: palette.inactiveTextColor,
                            textShadow: palette.inactiveTextShadow,
                        }}
                    >
                        {leftLabel}
                    </div>
                    <div
                        style={{
                            ...labelBaseStyle,
                            color: palette.inactiveTextColor,
                            textShadow: palette.inactiveTextShadow,
                        }}
                    >
                        {rightLabel}
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: pillInsetTop,
                        bottom: pillInsetBottom,
                        left: pillInsetX,
                        width: "calc(50% - 10px)",
                        borderRadius: pillRadius,
                        transform: sliderTransform,
                        zIndex: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 18px",
                        pointerEvents: "none",
                        color: palette.activeTextColor,
                        fontFamily,
                        fontSize,
                        fontWeight,
                        letterSpacing: "-0.06em",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        textShadow: palette.activeTextShadow,
                        transition: "transform 460ms cubic-bezier(0.22, 1, 0.36, 1), color 220ms ease",
                    }}
                >
                    {activeLabel}
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
    fontSize: 30,
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    activeTextColor: "rgb(23, 25, 31)",
    inactiveTextColor: "rgba(168, 173, 182, 0.78)",
    shellTint: "rgba(239, 241, 245, 1)",
    haloColor: "rgb(31, 58, 211)",
    padding: 10,
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
        type: ControlType.String,
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
        title: "Halo",
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
