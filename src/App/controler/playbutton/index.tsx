import React, { useState, useRef } from "react";
import styles from './index.module.scss';
import { Status } from "../../../shared/types";

type Props = {
  click: () => Promise<Status>,
}

export const PlayButton = ({ click }: Props) => {
  const [state, setState] = useState<Status | 'loading'>('stop');
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleClick = () => {
    ref.current && clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      setState('loading');
    }, 333);
    click().then(s => {
      ref.current && clearTimeout(ref.current);
      setState(s)
    });
  }
  return <div className={styles.button} onClick={handleClick}>
    {state === 'start'
      ? <div className={styles.stop} />
      : state === 'stop'
        ? <div className={styles.play} />
        : <div className={styles.loading} />
    }
  </div>
}