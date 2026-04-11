import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Selection = "left" | "right"

interface Props {
    leftLabel: string
    rightLabel: string
    leftLink: string
    rightLink: string
    openInNewTab: boolean
    interactiveLight: boolean
    defaultSelection: Selection
    fontSize: number
    fontFamily: string
    activeTextColor: string
    inactiveTextColor: string
    shellTint: string
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
        fontSize,
        fontFamily,
        activeTextColor,
        inactiveTextColor,
        shellTint,
        depth,
        lightIntensity,
        cornerRadius,
        style,
    } = props

    const [selection, setSelection] = React.useState<Selection>(defaultSelection)
    const [isHovering, setIsHovering] = React.useState(false)
    const [lightPosition, setLightPosition] = React.useState({ x: 0.28, y: 0.22 })

    React.useEffect(() => {
        setSelection(defaultSelection)
    }, [defaultSelection])

    const depthStrength = 0.72 + depth * 0.78
    const glowStrength = 0.48 + lightIntensity * 0.95
    const shellPadding = 10
    const pillInsetX = 10
    const pillInsetTop = 10
    const pillInsetBottom = 10
    const softRadius = Math.max(cornerRadius, 24)
    const cavityRadius = softRadius - shellPadding / 2
    const pillRadius = Math.max(cavityRadius - 8, 24)
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

    const resetLight = React.useCallback(() => {
        setIsHovering(false)
        setLightPosition({ x: 0.28, y: 0.22 })
    }, [])

    const handlePointerMove = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (!interactiveLight) return

            const bounds = event.currentTarget.getBoundingClientRect()
            if (bounds.width === 0 || bounds.height === 0) return

            const nextX = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1)
            const nextY = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1)

            setIsHovering(true)
            setLightPosition({ x: nextX, y: nextY })
        },
        [interactiveLight]
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
        fontWeight: 600,
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
            onPointerEnter={() => setIsHovering(true)}
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
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: softRadius,
                        background: `
                        linear-gradient(180deg,
                            rgba(255,255,255,0.98) 0%,
                            ${shellTint} 34%,
                            rgba(221,225,232,1) 72%,
                            rgba(191,196,205,1) 100%
                        )
                    `,
                    boxShadow: `
                        0 ${12 + depth * 10}px ${26 + lightIntensity * 10}px rgba(24,28,35,0.12),
                        0 2px 6px rgba(255,255,255,0.7),
                        inset 0 2px 1px rgba(255,255,255,1),
                        inset 0 -10px 16px rgba(133,140,151,0.18),
                        inset 0 16px 20px rgba(255,255,255,0.34)
                    `,
                    transition: "box-shadow 220ms ease, background 220ms ease",
                }}
            />

                <div
                    style={{
                        position: "absolute",
                        inset: shellPadding,
                        borderRadius: cavityRadius,
                        overflow: "hidden",
                        background: `
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
                    boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.08),
                        inset 0 10px 14px rgba(255,255,255,0.04),
                        inset 0 -18px 28px rgba(0,0,0,0.34),
                        inset 16px 0 22px rgba(255,255,255,0.02),
                        inset -20px 0 28px rgba(0,0,0,0.18)
                    `,
                    transition: "box-shadow 220ms ease, background 220ms ease",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: cavityRadius,
                        background: `
                            linear-gradient(180deg,
                                rgba(255,255,255,0.18) 0%,
                                rgba(255,255,255,0.02) 20%,
                                rgba(255,255,255,0) 54%
                            )
                        `,
                        pointerEvents: "none",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: cavityRadius,
                        background: `
                            radial-gradient(circle at ${cavityLightX - 4}% ${cavityLightY - 6}%,
                                rgba(255,255,255,${isHovering ? 0.14 * glowStrength : 0.08 * glowStrength}) 0%,
                                rgba(255,255,255,0) 34%
                            )
                        `,
                        pointerEvents: "none",
                        transition: "background 220ms ease",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: pillInsetTop + 12,
                        bottom: pillInsetBottom + 2,
                        left: pillInsetX + 8,
                        width: "calc(50% - 10px)",
                        transform: sliderTransform,
                        borderRadius: pillRadius,
                        background: `
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
                        filter: "blur(15px)",
                        opacity: 0.88,
                        pointerEvents: "none",
                        zIndex: 1,
                        transition: "transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease",
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
                        background: `
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
                        boxShadow: `
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
                        background: `
                            linear-gradient(118deg,
                                rgba(255,255,255,0) 18%,
                                rgba(255,255,255,${0.34 + lightIntensity * 0.08}) 34%,
                                rgba(255,255,255,0.14) 46%,
                                rgba(255,255,255,0.04) 56%,
                                rgba(255,255,255,0) 66%
                            )
                        `,
                        mixBlendMode: "screen",
                        opacity: interactiveLight ? 1 : 0.82,
                        pointerEvents: "none",
                        zIndex: 3,
                        transition:
                            "transform 460ms cubic-bezier(0.22, 1, 0.36, 1), background 220ms ease, opacity 220ms ease",
                    }}
                />

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
                            color: inactiveTextColor,
                            textShadow: "0 1px 0 rgba(255,255,255,0.06), 0 8px 18px rgba(0,0,0,0.28)",
                        }}
                    >
                        {leftLabel}
                    </div>
                    <div
                        style={{
                            ...labelBaseStyle,
                            color: inactiveTextColor,
                            textShadow: "0 1px 0 rgba(255,255,255,0.06), 0 8px 18px rgba(0,0,0,0.28)",
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
                        color: activeTextColor,
                        fontFamily,
                        fontSize,
                        fontWeight: 600,
                        letterSpacing: "-0.06em",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        textShadow: "0 1px 0 rgba(255,255,255,0.8), 0 10px 18px rgba(0,0,0,0.06)",
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
    fontSize: 30,
    fontFamily: "Inter, sans-serif",
    activeTextColor: "rgb(23, 25, 31)",
    inactiveTextColor: "rgba(168, 173, 182, 0.78)",
    shellTint: "rgba(239, 241, 245, 1)",
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
