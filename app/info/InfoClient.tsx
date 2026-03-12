'use client';

import { PrismicRichText } from '@prismicio/react';
import styles from '../../styles/InfoPage.module.css';
import { ViewTransition } from 'react';

const InfoComponent = (props) => {
  return (
    <ViewTransition>
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
    </ViewTransition>
  );
};

export default InfoComponent;
