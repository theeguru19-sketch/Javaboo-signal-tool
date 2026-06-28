import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';

export function useDerivSocket(symbol, isLive) {
  const [ticks, setTicks] = useState([]);
  const [digits, setDigits] = useState([]);
  const [status, setStatus] = useState('disconnected');
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    setStatus('connecting');
    setTicks([]);
    setDigits([]);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => {
      setStatus('connected');
      ws.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.msg_type === 'tick' && data.tick) {
        const price = data.tick.quote;
        const priceStr = price.toString();
        const lastDigit = parseInt(priceStr[priceStr.length - 1]);
        const tick = {
          time: new Date(data.tick.epoch * 1000).toLocaleTimeString(),
          price,
          digit: lastDigit,
        };
        setTicks(prev => [tick, ...prev].slice(0, 100));
        setDigits(prev => [...prev, lastDigit].slice(-100));
      }
    };
    ws.onerror = () => setStatus('error');
    ws.onclose = () => setStatus('disconnected');
  }, [symbol]);

  const disconnect = useCallback(() => {
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    setStatus('disconnected');
  }, []);

  useEffect(() => {
    if (isLive) { connect(); } else { disconnect(); }
    return () => disconnect();
  }, [isLive, symbol, connect, disconnect]);

  return { ticks, digits, status };
}
