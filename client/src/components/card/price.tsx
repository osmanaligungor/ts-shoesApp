import type { FC } from "react";
import type { Shoe } from "../../types";

interface Props {
  item: Shoe;
}

const Price: FC<Props> = ({ item }) => {
  let price = item.price;

  // indirim varsa indirimli fiyatı hesapla
  if (item.discount) {
    price = (item.price * (100 - item.discount)) / 100;
  }

  return (
    <div className={item.discount ? "text-my-yellow" : "text-white"}>
      ${price}
    </div>
  );
};

export default Price;
