'use client'
import React from 'react'
import DayCell from './DayCell'
import { startOfMonth, endOfMonth, startOfWeek, addDays, formatMonthTitle } from '../../utils/date'
import './MonthView.css'

type Props = {
    anchorDate: Date
    onPick: (d: Date) => void
    isInRange: (d: Date) => boolean
}


export default function MonthView({ anchorDate, onPick, isInRange }: Props) {
    const start = startOfMonth(anchorDate)
    const end = endOfMonth(anchorDate)
    const firstGridStart = startOfWeek(start)
    const weeks: Date[][] = []
    let cursor = firstGridStart
    while (cursor <= end || weeks.length < 4) {
        const week: Date[] = []
        for (let i = 0; i < 7; i++) {
            week.push(cursor)
            cursor = addDays(cursor, 1)
        }
        weeks.push(week)
        if (cursor > end && weeks.length >= 4) break
    }


    return (
        <div className="month-view">
            <div className="month-title">{formatMonthTitle(anchorDate)}</div>
            <div className="month-grid">
                {weeks.map((week, wi) => (
                    <div className="week-row" key={wi}>
                        {week.map((d) => (
                            <DayCell key={d.toISOString()} date={d} onPick={onPick} isInRange={isInRange} monthAnchor={anchorDate} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
