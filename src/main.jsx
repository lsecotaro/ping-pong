import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './effects.css';

const API_URL = import.meta.env.PONG_TEST_API_URL || 'https://pong.leosecotaro.com.ar/api/ping';

function App() {
  const [status, setStatus] = useState('idle');
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [response, setResponse] = useState('—');
  const [checks, setChecks] = useState([]);
  const [burst, setBurst] = useState(false);

  async function ping() {
    setBurst(true); window.setTimeout(() => setBurst(false), 850);
    setStatus('checking'); setResponse('...');
    const started = performance.now();
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      const text = (await res.text()).trim();
      const ms = Math.round(performance.now() - started);
      setLatency(ms); setResponse(text || 'empty'); setLastChecked(new Date());
      setStatus(res.ok && text === 'pong' ? 'online' : 'error');
      setChecks((items) => [...items, { ms, ok: res.ok && text === 'pong' }].slice(-20));
    } catch {
      setLatency(null); setResponse('unreachable'); setLastChecked(new Date()); setStatus('offline');
      setChecks((items) => [...items, { ms: Math.round(performance.now() - started), ok: false }].slice(-20));
    }
  }

  const label = { idle: 'READY', checking: 'CHECKING', online: 'PONG RECEIVED', error: 'UNEXPECTED RESPONSE', offline: 'NO RESPONSE' }[status];
  const successful = checks.filter((check) => check.ok);
  const average = successful.length ? Math.round(successful.reduce((sum, check) => sum + check.ms, 0) / successful.length) : null;
  const fastest = successful.length ? Math.min(...successful.map((check) => check.ms)) : null;
  const slowest = successful.length ? Math.max(...successful.map((check) => check.ms)) : null;
  return <main className={`shell ${burst ? 'matrix-burst' : ''}`}>
    <div className="rain" aria-hidden="true">{Array.from({length: 18}, (_, index) => <span key={index} style={{'--i': index}}>{'01アイウエオ'.repeat(5)}</span>)}</div>
    <div className="matrix" aria-hidden="true">0101 1100 0010 1011 0110 1001 0100 1110</div>
    <header className="topbar"><div className="brand"><span className="mark">✣</span><span>NEO / NETWORK LAB</span></div><span className="live"><i/> LOCAL TOOL</span></header>
    <section className="intro"><p className="eyebrow">API CONNECTION CHECKER <span>///</span> 001</p><h1>Ping<span>→</span>Pong</h1><p className="lede">A tiny instrument for checking whether your APIs are alive, reachable, and ready to answer.</p></section>
    <section className="console" aria-live="polite">
      <div className="console-head"><div><span className="dot"/> TARGET / <b>PUBLIC API</b></div><span className="mono">HTTPS</span></div>
      <div className="target"><span className="method">GET</span><code>{API_URL}</code></div>
      <div className={`result ${status}`}><div className="result-label">{label}</div><div className="result-value">{response === 'pong' ? 'pong' : response}</div><div className="metrics"><span>LATENCY <b>{latency ? `${latency} ms` : '—'}</b></span><span>HTTP <b>{status === 'online' ? '200 OK' : '—'}</b></span><span>LAST CHECK <b>{lastChecked ? lastChecked.toLocaleTimeString() : '—'}</b></span></div></div>
      <button className="ping-button" onClick={ping} disabled={status === 'checking'}><span>{status === 'checking' ? 'CHECKING...' : 'SEND PING'}</span><strong>↗</strong></button>
    </section>
    <section className="stats"><div className="section-title">SESSION TELEMETRY <span>{checks.length ? `LAST ${checks.length} CHECKS` : 'NO DATA YET'}</span></div><div className="stat-grid"><div><small>SUCCESS RATE</small><strong>{checks.length ? `${Math.round(successful.length / checks.length * 100)}%` : '—'}</strong></div><div><small>AVERAGE</small><strong>{average ? `${average} ms` : '—'}</strong></div><div><small>FASTEST</small><strong>{fastest ? `${fastest} ms` : '—'}</strong></div><div><small>SLOWEST</small><strong>{slowest ? `${slowest} ms` : '—'}</strong></div></div>{checks.length > 0 && <div className="chart" aria-label="Response time history">{checks.map((check, index) => <span key={`${index}-${check.ms}`} className={check.ok ? '' : 'failed'} style={{height:`${Math.max(10, Math.min(100, check.ms / Math.max(slowest, 1) * 100))}%`}} title={`${check.ms} ms`}/>)}</div>}</section>
    <footer><span>NEO MATRIX / v0.1</span><span>ONE BUTTON. ONE ANSWER.</span></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />);
