import React, { RefObject, useEffect, useState } from "react";
import styles from './index.module.scss';
import { Time } from "./time";
import { Info } from "./info";
import { PlayButton } from "./playbutton";
import { TimeType, InfoType, Status } from "../../shared/types";

export type Props = {
  time: RefObject<TimeType>,
  info?: InfoType,
  click: () => Promise<Status>,
  isReset: boolean,
}

export const Controler = ({ time, info, click, isReset }: Props) => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const change = () => {
      const { innerHeight } = window;
      setScale(innerHeight / 400 / 2);
    }
    change();
    window.addEventListener('resize', change);
    return () => window.removeEventListener('resize', change);
  }, [])
  return <div className={styles.container}>
    <div className={styles.controler} style={{ transform: `scale(${scale})` }}>
      <Info info={info} />
      <Time time={time} />
      <PlayButton click={click} isReset={isReset} />
    </div>
  </div>
}