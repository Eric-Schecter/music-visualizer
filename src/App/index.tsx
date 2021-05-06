import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './index.module.scss';
import { Viz } from './viz';
import { AudioProcessor } from './audio';
import { Controler } from './controler';
import { TimeType, InfoType } from '../shared/types';

const useAudio = () => {
  const [info, setInfo] = useState<InfoType>();
  const refAudio = useRef<AudioProcessor>(new AudioProcessor(360));
  const loadMusic = useCallback((url: string | ArrayBuffer) => {
    refAudio.current.load(url);
    refAudio.current.getmetadata().then(d => d && setInfo(d));
  }, [])
  return { info, loadMusic, refAudio };
}

export const App = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const refData = useRef<TimeType>({ currentTime: 0, duration: 0 });
  const { info, loadMusic, refAudio } = useAudio();
  useEffect(() => {
    if (!ref.current) { return }
    loadMusic('music.mp3');
    const viz = new Viz(ref.current, refAudio.current);
    refData.current = viz.data;
    return viz.unregister;
  }, [ref, loadMusic, refAudio])

  const dragover = (e: React.DragEvent) => {
    e.preventDefault();
  }

  const drop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (file.type.includes('audio')) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const res = e.target?.result;
          res && loadMusic(res);
        }
      }
    }
  }

  return <div className={styles.root}
    onDrop={drop}
    onDragOver={dragover}
  >
    <canvas ref={ref} className={styles.canvas} />
    <Controler time={refData} info={info} click={refAudio.current.start} />
  </div>
}