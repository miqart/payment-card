"use client";

import clsx from "clsx";
import AmexIcon from "icons/amex.svg";
import MasterIcon from "icons/master.svg";
import VisaIcon from "icons/visa.svg";
import { Ruda } from "next/font/google";
import { Dispatch, SetStateAction } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { getCardType, getFormattedDate } from "utils";

import { TPaymentCardSchema } from "./validation";

const ruda = Ruda({ weight: ["400", "700"], subsets: ["latin"] });

interface ICardViewProps {
  rotated: boolean;
  setRotated: Dispatch<SetStateAction<boolean>>;
}

const CardView = ({ rotated, setRotated }: ICardViewProps) => {
  const { control } = useFormContext<TPaymentCardSchema>();
  const [cardnumber, expires, name, cvv] = useWatch({
    control,
    name: ["cardnumber", "expires", "name", "cvv"],
  });

  const { isVisa, isMaster, isAmex } = getCardType(cardnumber);

  const onCardClick = () => {
    setRotated((prev) => !prev);
  };

  return (
    <div
      className={clsx(
        ruda.className,
        "perspective500 group absolute inset-x-0 mx-auto mt-[-110px] h-[210px] w-[333px] cursor-pointer"
      )}
      id="card"
      onClick={onCardClick}
      tabIndex={0}
    >
      <div
        className={clsx(
          "rounded-lg relative h-full bg-neutral-950  ",
          "cardShadow preserve-3d rotateTransition",
          rotated && "rotate-y-180"
        )}
      >
        <div
          className={clsx(
            "bg-cover absolute h-full w-full bg-[url('/card-front.png')] bg-no-repeat px-6 pt-24 text-left",
            "backface-hidden"
          )}
        >
          <span className="cardText text-xl h-7">{cardnumber.match(/.{1,4}/g)?.join(" ")}</span>
          <div className="flex items-center gap-x-1 cursor-pointer">
            <span className="cardTextLabel">Valid Thru</span>
            <span className="cardText">{getFormattedDate(expires)}</span>
          </div>
          <div className="flex items-center mt-4 h-8">
            <span className="cardText text-s px-1">{name}</span>
            <div className="ml-auto">
              {isVisa && <VisaIcon />}
              {isMaster && <MasterIcon />}
              {isAmex && <AmexIcon />}
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "absolute h-full w-full bg-[url('/card-back.png')] bg-no-repeat bg-cover rounded-lg",
            "rotate-y-180 backface-hidden"
          )}
        >
          <div className="flex items-center gap-x-5 pt-20 px-6 cursor-pointer">
            <span className="cardTextLabel text-sm">CVV</span>
            <span className="cardText text-slate-800 italic h-6">{cvv}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardView;
