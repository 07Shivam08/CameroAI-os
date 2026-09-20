import React from "react";
import Image from "next/image";
type Props = {};

const GPTLogo = (props: Props) => {
  return (
    <Image
      src="/CameroChatLogo.png"
      alt="Camero AI Logo"
      width={50}
      height={50}
      className="w-10 h-10 object-contain rounded-full mr-1 border-2 border-emerald-300"
    />
  );
};

export default GPTLogo;
