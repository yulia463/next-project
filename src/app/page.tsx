"use client";

import React, {useState} from 'react'
import Calendar from '../components/Calendar/Calendar'


export default function Home() {
  const [mode, setMode] = useState<'week' | 'month'>('week')


  return (
      <div className="page-root">
        <main className="container">
          <h1 className="title">Mobile Calendar</h1>

          <div className="controls">
            <label>
              <input
                  type="radio"
                  name="mode"
                  checked={mode === 'week'}
                  onChange={() => setMode('week')}
              />
              Неделя
            </label>
            <label>
              <input
                  type="radio"
                  name="mode"
                  checked={mode === 'month'}
                  onChange={() => setMode('month')}
              />
              Месяц
            </label>
          </div>
          <Calendar mode={mode} />
          <p className="hint">Поддерживается жест прокрутки, snap и корректная обработка касания vs тап.</p>
        </main>
      </div>
  )
}
