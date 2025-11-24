"use client";
import React, { useState, useEffect } from 'react'
import { formatPretty } from '../../utils/date'

type Props = {
    start: Date | null
    end: Date | null
    onClear: () => void
}

export default function RangePreview({ start, end, onClear }: Props) {
    const [startStr, setStartStr] = useState('—')
    const [endStr, setEndStr] = useState('—')

    useEffect(() => {
        setStartStr(start ? formatPretty(start) : '—')
        setEndStr(end ? formatPretty(end) : '—')
    }, [start, end])

    return (
        <div className="range-preview">
            <div className="range-text">
                {startStr} — {endStr}
            </div>
            <button className="clear-btn" onClick={onClear}>Сброс</button>
        </div>
    )
}
