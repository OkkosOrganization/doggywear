import { useEffect } from 'react';

type RelatedProductsProps = {
  products: any;
  exclude?: string;
};
export const RelatedProducts = ({
  products,
  exclude,
}: RelatedProductsProps): JSX.Element => {
  if (!products) return null;

  return (
    <div>
      <h3>You might also like</h3>
      <div>
        {products
          .filter((p) => {
            return p.uid !== exclude;
          })
          .map((p, pindex) => {
            return <div key={'RelatedProduct' + pindex}>{p.uid}</div>;
          })}
      </div>
    </div>
  );
};
