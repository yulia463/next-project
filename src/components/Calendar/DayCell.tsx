'use client'

import React from 'react'
import { formatDayNumber, isSameDay } from '../../utils/date'
import './DayCell.css'

type Props = {
    date: Date
    onPick: (d: Date) => void
    isInRange: (d: Date) => boolean
    monthAnchor?: Date
}


export default function DayCell({ date, onPick, isInRange, monthAnchor }: Props) {
    const inRange = isInRange(date)
    const today = isSameDay(date, new Date())
    const outOfMonth = monthAnchor ? date.getMonth() !== monthAnchor.getMonth() : false

    return (
        <button
            className={`day-cell ${inRange ? 'in-range' : ''} ${today ? 'today' : ''} ${outOfMonth ? 'out-month' : ''}`}
            onClick={() => onPick(date)}
        >
            <div className="day-number">{formatDayNumber(date)}</div>
        </button>
    )
}
