import React from 'react';
import Prismic from 'prismic-javascript';
import { apiEndPoint } from '../config/prismic';
import { RichText } from 'prismic-reactjs';
import styles from '../styles/InfoPage.module.scss';

export const getStaticProps = async ({ req }) => {
  let about = null;
  try {
    const prismicApi = await Prismic.getApi(apiEndPoint, { req: req });
    about = await prismicApi.getSingle('info-page');
  } catch (e) {
    console.log(e);
  }
  return {
    props: {
      about: about ? about : null,
    },
    revalidate: 1,
  };
};

const InfoPage = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {props.about ? (
          <div>
            <h1 className={styles.pageTitle}>
              {props.about.data.title[0].text}
            </h1>
            {RichText.render(props.about.data.content)}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InfoPage;
