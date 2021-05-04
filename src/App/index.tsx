import React, { useRef, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Viz } from './viz';
import { AudioProcessor } from './audio';
import { Controler } from './controler';
import { TimeType, InfoType, Status } from '../shared/types';

export const App = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const refData = useRef<TimeType>({ currentTime: 0, duration: 0 });
  const [info, setInfo] = useState<InfoType>();
  const refClick = useRef<() => Promise<Status>>(()=>Promise.resolve('stop'));
  useEffect(() => {
    if (!ref.current) { return }
    const audio = new AudioProcessor('music.mp3', 360);
    audio.getmetadata().then(d => setInfo(d));
    const viz = new Viz(ref.current, audio);
    refData.current = viz.data;
    refClick.current = viz.click;
    return viz.unregister;
  }, [ref])

  return <div className={styles.root}>
    <canvas ref={ref} className={styles.canvas} />
    <Controler time={refData} info={info} click={refClick} />
  </div>
}