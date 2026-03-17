import { useRef, useState, useEffect, MouseEvent } from 'react';
import Image from 'next/image';
import styles from '../styles/SizeChart.module.css';

export type SizeChartRow = {
  size: string;
  widthCm: string;
  widthInch: string;
  lengthCm: string;
  lengthInch: string;
};

export type SizeChartData = {
  modelName: string;
  shirtImageSrc?: string;
  rows: SizeChartRow[];
};

export type SizeChartUnit = 'cm' | 'inch';

interface SizeChartProps {
  sizeChart: SizeChartData;
  open: boolean;
  onClose: () => void;
}

export const SizeChart= ({
  sizeChart,
  open,
  onClose,
}: SizeChartProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [unit, setUnit] = useState<SizeChartUnit>('cm');

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  const handleDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.sizeChartModal}
      onClick={handleDialogClick}
    >
      <div className={styles.sizeChartModalContent}>
        <button
          type="button"
          onClick={onClose}
          className={styles.sizeChartModalCloseButton}
          aria-label="Close size chart"
        >
          ×
        </button>
        <div className={styles.sizeChartUnitToggle}>
          <button
            type="button"
            className={`${styles.sizeChartUnitButton} ${
              unit === 'cm' ? styles.sizeChartUnitButtonActive : ''
            }`}
            onClick={() => setUnit('cm')}
          >
            cm
          </button>
          <button
            type="button"
            className={`${styles.sizeChartUnitButton} ${
              unit === 'inch' ? styles.sizeChartUnitButtonActive : ''
            }`}
            onClick={() => setUnit('inch')}
          >
            inch
          </button>
        </div>
        <div className={styles.sizeChartBody}>
          {sizeChart.shirtImageSrc && (
            <div className={styles.sizeChartIllustration}>
              <Image
                src={sizeChart.shirtImageSrc}
                alt={`${sizeChart.modelName} measurement guide`}
                width={800}
                height={1000}
                className={styles.sizeChartShirtImage}
                sizes="(max-width: 40rem) 90vw, 20rem"
                quality={70}
              />
            </div>
          )}
          <div className={styles.sizeChartTableWrap}>
            <table className={styles.sizeChartTable}>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>{`Width (A) ${unit}`}</th>
                  <th>{`Length (B) ${unit}`}</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.rows.map((row) => (
                  <tr key={row.size}>
                    <th scope="row">{row.size}</th>
                    <td>{unit === 'cm' ? row.widthCm : row.widthInch}</td>
                    <td>{unit === 'cm' ? row.lengthCm : row.lengthInch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </dialog>
  );
};
