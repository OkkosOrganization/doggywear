'use client';

import React from 'react';
import { PrismicRichText } from '@prismicio/react';
import styles from '../../styles/InfoPage.module.css';
import { useWindowSize } from '../../hooks/useWindowSize';

const InfoComponent = (props) => {
  // using the window size hook to trigger context updates/resizes if needed like in the original layout logic,
  // though this specific component doesn't seem to use `ww` directly.
  useWindowSize();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {props.about ? (
          <div>
            <h1 className={styles.pageTitle}>
              {props.about.data.title[0].text}
            </h1>
            <PrismicRichText field={props.about.data.content} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InfoComponent;
