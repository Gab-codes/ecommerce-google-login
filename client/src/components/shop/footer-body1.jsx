import { CircleUserRound, Headset, Tag } from "lucide-react";

export default function FooterBodyUp() {
  return (
    <div className="bg-[#F5F7FF] py-10 px-10 md:px-15">
      <ul className="flex flex-wrap justify-center items-center md:flex-row md:gap-0 gap-7">
        <li className="flex flex-col items-center justify-center w-[275px] md:w-[255px] text-center gap-3 md:gap-5 p-5">
          <Headset className="w-[38px] h-[38px] md:w-[45px] md:h-[45px]" alt="support icon" />
          <h2 className="text-lg font-bold">Dedicated Product Support</h2>
          <p className="text-sm">Comprehensive support and assistance whenever you need it.</p>
        </li>
        <li className="flex flex-col items-center justify-center w-[275px] md:w-[255px] text-center gap-3 md:gap-5 p-5">
          <CircleUserRound className="w-[38px] h-[38px] md:w-[45px] md:h-[45px]" alt="account icon image" />
          <h2 className="text-lg font-bold">Exclusive Personal Account</h2>
          <p className="text-sm">
            Enjoy personalized service with discounts and faster checkout process.
          </p>
        </li>
        <li className="flex flex-col items-center justify-center w-[275px] md:w-[255px] text-center gap-3 md:gap-5 p-5">
          <Tag className="w-[38px] h-[38px] md:w-[45px] md:h-[45px]" alt="savings icon image" />
          <h2 className="text-lg font-bold">Incredible Savings</h2>
          <p className="text-sm">
            Take advantage of special offers and savings, with sales discounts.
          </p>
        </li>
      </ul>
    </div>
  );
}
