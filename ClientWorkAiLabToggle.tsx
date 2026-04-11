import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Selection = "left" | "right"

interface Props {
    leftLabel: string
    rightLabel: string
    defaultSelection: Selection
    fontSize: number
    fontFamily: string
    activeTextColor: string
    inactiveTextColor: string
    dividerColor: string
    rimHighlight: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 360
 * @framerIntrinsicHeight 112
 */
export default function ClientWorkAiLabToggle(props: Props) {
    const {
        leftLabel,
        rightLabel,
        defaultSelection,
        fontSize,
        fontFamily,
        activeTextColor,
        inactiveTextColor,
        dividerColor,
        rimHighlight,
        style,
    } = props

    const [selection, setSelection] = React.useState<Selection>(defaultSelection)

    React.useEffect(() => {
        setSelection(defaultSelection)
    }, [defaultSelection])

    const sharedLabelStyle: React.CSSProperties = {
        position: "relative",
        zIndex: 2,
        width: "50%",
        height: "100%",
        border: "none",
        background: "transparent",
        padding: 0,
        margin: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        fontSize,
        fontFamily,
        fontWeight: 600,
        letterSpacing: "-0.04em",
        transition: "color 220ms ease, transform 220ms ease",
    }

    return (
        <div
            style={{
                ...style,
                width: style?.width ?? 360,
                height: style?.height ?? 112,
                position: "relative",
                borderRadius: 999,
                padding: 9,
                overflow: "hidden",
                background:
                    "linear-gradient(180deg, rgba(250,250,252,1) 0%, rgba(232,235,241,1) 58%, rgba(214,220,229,1) 100%)",
                boxShadow: `
                    inset 0 2px 2px rgba(255,255,255,0.98),
                    inset 0 -8px 14px rgba(162,171,184,${0.2 + rimHighlight * 0.18}),
                    0 18px 28px rgba(145,152,165,0.18),
                    0 4px 10px rgba(255,255,255,0.9)
                `,
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: 999,
                    background:
                        "linear-gradient(135deg, rgba(236,239,245,1) 0%, rgba(255,255,255,0.98) 30%, rgba(243,245,249,1) 58%, rgba(226,231,239,1) 100%)",
                    boxShadow: `
                        inset 10px 10px 22px rgba(255,255,255,0.92),
                        inset -14px -14px 24px rgba(176,184,196,0.24)
                    `,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "18%",
                        width: 1,
                        height: "64%",
                        transform: "translateX(-0.5px)",
                        background: dividerColor,
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.3)",
                        zIndex: 1,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 7,
                        bottom: 7,
                        left: 7,
                        width: "calc(50% - 7px)",
                        borderRadius: 999,
                        transform:
                            selection === "left" ? "translateX(0%)" : "translateX(100%)",
                        transition:
                            "transform 360ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 240ms ease",
                        background:
                            "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,249,252,1) 38%, rgba(235,239,246,1) 100%)",
                        boxShadow: `
                            0 14px 20px rgba(163,170,182,0.24),
                            0 4px 10px rgba(255,255,255,0.85),
                            inset 0 1px 0 rgba(255,255,255,0.98),
                            inset 0 -6px 10px rgba(178,186,198,0.18)
                        `,
                        zIndex: 0,
                    }}
                />

                <div
                    role="tablist"
                    aria-label="Client Work or AI Lab"
                    style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={selection === "left"}
                        onClick={() => setSelection("left")}
                        style={{
                            ...sharedLabelStyle,
                            color:
                                selection === "left"
                                    ? activeTextColor
                                    : inactiveTextColor,
                            transform:
                                selection === "left"
                                    ? "translateY(-0.5px)"
                                    : "translateY(0px)",
                        }}
                    >
                        {leftLabel}
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={selection === "right"}
                        onClick={() => setSelection("right")}
                        style={{
                            ...sharedLabelStyle,
                            color:
                                selection === "right"
                                    ? activeTextColor
                                    : inactiveTextColor,
                            transform:
                                selection === "right"
                                    ? "translateY(-0.5px)"
                                    : "translateY(0px)",
                        }}
                    >
                        {rightLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

ClientWorkAiLabToggle.defaultProps = {
    leftLabel: "Client Work",
    rightLabel: "AI Lab",
    defaultSelection: "left",
    fontSize: 29,
    fontFamily: "Inter, sans-serif",
    activeTextColor: "rgb(28, 31, 38)",
    inactiveTextColor: "rgb(153, 158, 168)",
    dividerColor: "rgba(189, 195, 205, 0.7)",
    rimHighlight: 0.7,
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
        max: 48,
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
    dividerColor: {
        type: ControlType.Color,
        title: "Divider",
    },
    rimHighlight: {
        type: ControlType.Number,
        title: "Depth",
        min: 0,
        max: 1,
        step: 0.05,
        displayStepper: true,
    },
})
