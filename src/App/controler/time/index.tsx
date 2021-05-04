import React, { useEffect, useState, useRef, RefObject } from "react";
import styles from './index.module.scss';
import { TimeType } from "../../../shared/types";

type Props ={
  time:RefObject<TimeType>,
}

export const Time = ({ time }: Props) => {
  const [progress, setProgress] = useState('00:00');
  const reftime = useRef(0);
  useEffect(() => {
    const handleTime = (num: number) => {
      return num < 10 ? `0${num}` : num;
    }
    const timer = setInterval(() => {
      if (!time.current) { return }
      const { currentTime } = time.current;
      const curr = ~~currentTime;
      reftime.current = curr;
      const minute = ~~(curr / 60);
      const second = curr % 60;
      setProgress(`${handleTime(minute)}:${handleTime(second)}`);
    }, 300);
    return () => clearInterval(timer);
  }, [time])
  return <div className={styles.time}>
    <div>{progress}</div>
  </div>
}