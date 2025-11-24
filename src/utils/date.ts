// src/utils/date.ts
export function addDays(d: Date, days: number) {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
}

export function addMonths(d: Date, months: number) {
    const r = new Date(d);
    r.setMonth(r.getMonth() + months);
    return r;
}

export function startOfWeek(d: Date) {
    // неделя начинается с понедельника
    const r = new Date(d);
    const day = r.getDay(); // 0 (вс) .. 6 (сб)
    const isoDay = day === 0 ? 7 : day; // переводим вс -> 7
    r.setDate(r.getDate() - (isoDay - 1));
    r.setHours(0, 0, 0, 0);
    return r;
}

export function startOfMonth(d: Date) {
    const r = new Date(d.getFullYear(), d.getMonth(), 1);
    r.setHours(0, 0, 0, 0);
    return r;
}

export function endOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function formatISODate(d: Date) {
    // YYYY-MM-DD
    return d.toISOString().slice(0, 10);
}

export function isSameDay(a: Date, b: Date) {
    return formatISODate(a) === formatISODate(b);
}

export function formatDayNumber(d: Date) {
    return String(d.getDate());
}

export function formatPretty(d: Date) {
    // локализованный краткий формат
    return d.toLocaleDateString();
}

export function formatWeekTitle(start: Date) {
    const end = addDays(start, 6);
    return `${start.toLocaleDateString()} — ${end.toLocaleDateString()}`;
}

export function formatMonthTitle(d: Date) {
    return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
}
