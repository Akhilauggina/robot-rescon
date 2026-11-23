import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  commandAi,
  commandClearLog,
  commandPause,
  commandReset,
  commandStart,
  createMissionState,
  makeSnapshot,
  updateMission,
} from '../simulation/engine';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const simRef = useRef(null);
  if (!simRef.current) simRef.current = createMissionState();
  const [snap, setSnap] = useState(() => makeSnapshot(simRef.current));

  const publish = () => setSnap(makeSnapshot(simRef.current));

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      try {
        updateMission(simRef.current, dt);
      } catch (error) {
        console.error(error);
      }
      acc += dt;
      if (acc >= 0.1) {
        acc = 0;
        if (!document.hidden) setSnap(makeSnapshot(simRef.current));
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const api = useMemo(
    () => ({
      simRef,
      start() {
        commandStart(simRef.current);
        publish();
      },
      pause() {
        commandPause(simRef.current);
        publish();
      },
      reset() {
        commandReset(simRef.current);
        publish();
      },
      clearLog() {
        commandClearLog(simRef.current);
        publish();
      },
      setAi(enabled) {
        commandAi(simRef.current, enabled);
        publish();
      },
      setKey(key, down) {
        const keys = simRef.current.keys;
        if (down) keys.add(key);
        else keys.delete(key);
      },
      clearKeys() {
        simRef.current.keys.clear();
      },
    }),
    [],
  );

  const value = useMemo(() => ({ ...api, snap }), [api, snap]);
  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSim() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSim must be used within SimulationProvider');
  return ctx;
}
