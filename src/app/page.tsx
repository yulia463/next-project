"use client";
import React, {useState} from 'react'
import dynamic from 'next/dynamic'
import Calendar from '../components/Calendar/Calendar'


export default function Home() {
  const [mode, setMode] = useState<'week' | 'month'>('week')


  return (
      <div className="page-root">
        <main className="container">
          <h1 className="title">Mobile Range Calendar — Demo</h1>


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
