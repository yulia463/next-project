"use client";
import React, { useState, useEffect } from 'react'
import DayCell from './DayCell'
import { startOfWeek, addDays, formatWeekTitle } from '../../utils/date'
import './WeekView.css'

type Props = {
    anchorDate: Date
    onPick: (d: Date) => void
    isInRange: (d: Date) => boolean
}

export default function WeekView({ anchorDate, onPick, isInRange }: Props) {
    const [days, setDays] = useState<Date[]>([])
    const [weekTitle, setWeekTitle] = useState('')

    useEffect(() => {
        const start = startOfWeek(anchorDate)
        const newDays: Date[] = []
        for (let i = 0; i < 7; i++) newDays.push(addDays(start, i))
        setDays(newDays)
        setWeekTitle(formatWeekTitle(start)) // форматируем только на клиенте
    }, [anchorDate])

    return (
        <div className="week-view">
            <div className="week-title">{weekTitle}</div>
            <div className="week-grid">
                {days.map((d) => (
                    <DayCell key={d.toISOString()} date={d} onPick={onPick} isInRange={isInRange} />
                ))}
            </div>
        </div>
    )
}
