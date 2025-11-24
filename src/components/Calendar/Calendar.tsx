'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import WeekView from './WeekView'
import MonthView from './MonthView'
import RangePreview from './RangePreview'
import { addDays, startOfWeek, formatISODate, addMonths, startOfMonth } from '../../utils/date'
import useTouchClick from '../../hooks/useTouchClick'
type Props = {
    mode: 'week' | 'month'
}


const RANGE_PAGES = 5 // рендерим 5 страниц: центр + 2 вверх + 2 вниз
export default function Calendar({ mode }: Props) {
    const [anchorDate, setAnchorDate] = useState<Date>(() => new Date())
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)


    const containerRef = useRef<HTMLDivElement | null>(null)
    const isDraggingRef = useRef(false)


// differentiate click vs scroll
    useTouchClick(containerRef)
    const pages = useMemo(() => {
        const arr: Date[] = []
        if (mode === 'week') {
            const base = startOfWeek(anchorDate)
            for (let i = -2; i <= 2; i++) arr.push(addDays(base, i * 7))
        } else {
            const base = startOfMonth(anchorDate)
            for (let i = -2; i <= 2; i++) arr.push(addMonths(base, i))
        }
        return arr
    }, [anchorDate, mode])

// переключение anchorDate при достижении краёв
    const onScroll = useCallback(() => {
        const el = containerRef.current
        if (!el) return
        const pageHeight = el.clientHeight
        const scrollTop = el.scrollTop
        const center = Math.round(scrollTop / pageHeight)
// когда пользователь прокрутил к верхней или нижней странице, смещаем anchor
        if (center <= 1) {
// вверх
            setAnchorDate((d) => (mode === 'week' ? addDays(startOfWeek(d), -7) : addMonths(startOfMonth(d), -1)))
            el.scrollTop = pageHeight * 2 // сброс видимой позиции к центру
        } else if (center >= 3) {
            setAnchorDate((d) => (mode === 'week' ? addDays(startOfWeek(d), 7) : addMonths(startOfMonth(d), 1)))
            el.scrollTop = pageHeight * 2
        }
    }, [mode])

useEffect(() => {
    const el = containerRef.current
    if (!el) return
// устанавливаем позицию на центральную страницу
    el.scrollTop = el.clientHeight * 2
    let raf = 0
    const handler = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(onScroll)
    }
    el.addEventListener('scroll', handler, { passive: true })
    return () => {
        el.removeEventListener('scroll', handler)
        cancelAnimationFrame(raf)
    }
}, [onScroll, mode, pages])


// выбор дат: если тап и диапазон не задан
const onPickDate = useCallback((date: Date) => {
// if no start — set start, else set end (if date < start — swap)
    if (!startDate || (startDate && endDate)) {
        setStartDate(date)
        setEndDate(null)
    } else {
        if (date < startDate) {
            setEndDate(startDate)
            setStartDate(date)
        } else {
            setEndDate(date)
        }
    }
}, [startDate, endDate])


const isInRange = useCallback((d: Date) => {
    if (!startDate) return false
    if (!endDate) return formatISODate(startDate) === formatISODate(d)
    return d >= startDate && d <= endDate
}, [startDate, endDate])


return (
    <div className="calendar-shell">
        <RangePreview start={startDate} end={endDate} onClear={() => { setStartDate(null); setEndDate(null) }} />


        <div
            ref={containerRef}
            className={`scroll-pages ${mode === 'week' ? 'week-mode' : 'month-mode'}`}
            // prevent default touchmove when needed? let native scrolling handle it
        >
            {pages.map((p, idx) => (
                <div className="page" key={idx}>
                    {mode === 'week' ? (
                        <WeekView anchorDate={p} onPick={onPickDate} isInRange={isInRange} />
                    ) : (
                        <MonthView anchorDate={p} onPick={onPickDate} isInRange={isInRange} />
                    )}
                </div>
            ))}
        </div>


        <div className="legend">Swipe вверх/вниз — переключение. Tap — выбрать дату.</div>
    </div>
)
}
