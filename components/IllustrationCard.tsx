import Image from 'next/image';
import styles from '../styles/IllustrationCard.module.scss';

type IllustrationCardProps = {
  data: any;
  mouseEnterHandler: (e) => void;
  mouseLeaveHandler: (e) => void;
};
export const IllustrationCard = (props: IllustrationCardProps): JSX.Element => {
  return (
    <div
      className={`${styles.illustration} gridItem`}
      id={props.data.id}
      onMouseEnter={() => null} //props.mouseEnterHandler(props.data.id)}
      onMouseLeave={() => null} //props.mouseLeaveHandler(props.data.id)}
    >
      <Image
        src={props.data?.data?.image?.url}
        layout="responsive"
        width={props.data?.data?.image?.dimensions?.width}
        height={props.data?.data?.image?.dimensions?.height}
        alt={'Illustration image'}
      />
    </div>
  );
};
