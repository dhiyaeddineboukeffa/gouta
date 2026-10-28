import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, t } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={t('CART_TOTALS').split(' ')[0]} text2={t('CART_TOTALS').split(' ')[1] || ''} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>{t('SUBTOTAL')}</p>
          <p>
            {currency} {getCartAmount()}.00
          </p>
        </div>
        {delivery_fee > 0 && (
          <div className="flex justify-between">
            <p>{t('TRANSPORTATION_FEE')}</p>
            <p>
              {currency} {delivery_fee}.00
            </p>
          </div>
        )}
        <hr />
        <div className="flex justify-between">
          <b>{t('TOTAL')}</b>
          <b>
            {currency}{" "}
            {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
