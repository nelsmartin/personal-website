"use client";
import Image from "next/image";

const CARD_COUNT = 169
export default function Bold() {
    
  const  matrix =
    [
        true, false, true, true, false, 
        false, false, true, false, false,
        false, true, false, true, false, 
        true, true, true, true, false, 
        false, false, false, false, false, 
    ]
  

    const imageInit = (index : number, value: boolean) => {
      if (index % 2 == 0) {
        if (value) return "/tileLeftNormal.svg"
        return "/tileRightInverted.svg"
      }
      if (value) return "/tileLeftInverted.svg"
      return "/tileRightNormal.svg"
    } 

    return (
      <div className="flex flex-col items-center space-y-5">
            <div className="grid grid-cols-5 place-items-center group-hover:shadow-2xl">
                {matrix.map((value, index) => (
                    <Image
                    key={index}
                    src={imageInit(index, value)}
                    alt="Truchet tile"
                    height={100}
                    width={100}
                    />
                ))}
              </div>
              <p 
              className="text-4xl text-black group-hover:font-bold group-hover:underline">
                Bold
                </p>
      </div>
    )
}
    
    
