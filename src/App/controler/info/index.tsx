import React, { useEffect, useState } from "react";
import styles from './index.module.scss';
import { InfoType } from "../../../shared/types";

type Props = {
  info?: InfoType
}

export const Info = ({ info }: Props) => {
  const [data, setData] = useState({ artist: '', album: '', title: '' });
  useEffect(() => {
    if (!info) {
      return;
    }
    setData(info);
  }, [info])
  const { artist, album, title } = data;
  return <div className={styles.info}> 
    <p>{title}</p>
    <p>{artist}</p>
    <p>{album}</p>
  </div>
}