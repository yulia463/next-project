'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import WeekView from './WeekView';
import MonthView from './MonthView';
import RangePreview from './RangePreview';
import { addDays, startOfWeek, formatISODate, addMonths, startOfMonth } from '../../utils/date';
import useTouchClick from '../../hooks/useTouchClick';
import './Calendar.css'

type Props = { mode: 'week' | 'month' };

const RANGE_PAGES = 5; // всегда 5 страниц: 2 вверх, 1 центр, 2 вниз

export default function Calendar({ mode }: Props) {
    const [anchorDate, setAnchorDate] = useState<Date>(() => new Date());
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const isUpdatingRef = useRef(false);

    useTouchClick(containerRef);

    // Генерация страниц вокруг anchorDate
    const pages = useMemo(() => {
        const arr: Date[] = [];
        if (mode === 'week') {
            const base = startOfWeek(anchorDate);
            for (let i = -2; i <= 2; i++) arr.push(addDays(base, i * 7));
        } else {
            const base = startOfMonth(anchorDate);
            for (let i = -2; i <= 2; i++) arr.push(addMonths(base, i));
        }
        return arr;
    }, [anchorDate, mode]);

    // Устанавливаем scrollTop на центр страницы при монтировании
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.scrollTop = el.clientHeight * 2;
    }, [pages]);

    // Реакция на скролл: только при достижении верхней или нижней страницы
    const onScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el || isUpdatingRef.current) return;

        const pageHeight = el.clientHeight;
        const scrollTop = el.scrollTop;
        const centerIndex = Math.round(scrollTop / pageHeight);

        if (centerIndex <= 0) {
            isUpdatingRef.current = true;
            // скролл вверх — сдвигаем anchorDate на предыдущую неделю/месяц
            setAnchorDate((d) => (mode === 'week' ? addDays(d, -7) : addMonths(d, -1)));
            el.scrollTop += pageHeight; // минимальная корректировка
            setTimeout(() => (isUpdatingRef.current = false), 50);
        } else if (centerIndex >= 4) {
            isUpdatingRef.current = true;
            // скролл вниз — сдвигаем anchorDate на следующую неделю/месяц
            setAnchorDate((d) => (mode === 'week' ? addDays(d, 7) : addMonths(d, 1)));
            el.scrollTop -= pageHeight; // минимальная корректировка
            setTimeout(() => (isUpdatingRef.current = false), 50);
        }
    }, [mode]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handler = () => requestAnimationFrame(onScroll);
        el.addEventListener('scroll', handler, { passive: true });
        return () => el.removeEventListener('scroll', handler);
    }, [onScroll]);

    const onPickDate = useCallback(
        (date: Date) => {
            if (!startDate || (startDate && endDate)) {
                setStartDate(date);
                setEndDate(null);
            } else {
                if (date < startDate) {
                    setEndDate(startDate);
                    setStartDate(date);
                } else {
                    setEndDate(date);
                }
            }
        },
        [startDate, endDate]
    );

    const isInRange = useCallback(
        (d: Date) => {
            if (!startDate) return false;
            if (!endDate) return formatISODate(startDate) === formatISODate(d);
            return d >= startDate && d <= endDate;
        },
        [startDate, endDate]
    );

    return (
        <div className="calendar-shell">
            <RangePreview
                start={startDate}
                end={endDate}
                onClear={() => {
                    setStartDate(null);
                    setEndDate(null);
                }}
            />
            <div ref={containerRef} className={`scroll-pages ${mode === 'week' ? 'week-mode' : 'month-mode'}`}>
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
    );
}
