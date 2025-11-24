'use client'
import { useEffect, RefObject } from 'react';


type Options = {
    threshold?: number; // px
    suppressClickMs?: number; // время, в течение которого click будет подавляться после движения
};

export default function useTouchClick(
    ref: RefObject<HTMLElement | null>,
    options: Options = {}
) {
    const { threshold = 8, suppressClickMs = 300 } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let startX = 0;
        let startY = 0;
        let moved = false;
        let lastMovedAt = 0;

        function onTouchStart(e: TouchEvent) {
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
            moved = false;
        }

        function onTouchMove(e: TouchEvent) {
            const t = e.touches[0];
            const dx = Math.abs(t.clientX - startX);
            const dy = Math.abs(t.clientY - startY);
            if (dx > threshold || dy > threshold) {
                moved = true;
                lastMovedAt = Date.now();
            }
        }

        function onTouchEnd() {
            // touchend — оставляем moved флаг, чтобы click сразу после жеста был подавлен
            if (moved) {
                lastMovedAt = Date.now();
            }
            // сбрасываем moved через небольшую задержку (на случай быстрых последующих взаимодействий)
            setTimeout(() => {
                moved = false;
            }, suppressClickMs + 50);
        }

        function onClick(e: MouseEvent) {
            // если был недавний сдвиг — подавляем click
            if (Date.now() - lastMovedAt < suppressClickMs) {
                e.preventDefault();
                e.stopPropagation();
                // дополнительная защита: если нативный обработчик уже поставлен — ничего не позволяет случиться
                return;
            }
            // иначе — нормальный клик
        }

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: true });
        el.addEventListener('touchend', onTouchEnd);
        el.addEventListener('click', onClick, true); // capture = true — чтобы перехватить раньше других

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
            el.removeEventListener('click', onClick, true);
        };
    }, [ref, threshold, suppressClickMs]);
}
