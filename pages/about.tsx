import React from 'react';
import Prismic from 'prismic-javascript';
import { apiEndPoint } from '../config/prismic';
import styles from "../sass/AboutPage.module.scss";
import { RichText } from 'prismic-reactjs';

export const getStaticProps = async ({ req, locale }) => {

  let about = null;

  try {
    let prismicApi = await Prismic.getApi(apiEndPoint, { req: req });
    about = await prismicApi.getSingle('about-page');
  }
  catch (e) {
    console.log(e);
  }

  return {
    props:
    {
      about: about ? about : null
    },
    revalidate: 1
  };
}

const AboutPage = (props) => {

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {
          props.about
            ?
            <div>
              <h1 className={styles.pageTitle}>{props.about.data.title[0].text}</h1>
              {RichText.render(props.about.data.content)}
            </div>
            :
            null
        }

      </div>
    </div>
  );
}
export default AboutPage;