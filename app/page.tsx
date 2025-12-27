import Image from "next/image";


export default function Home() {
  return (
    <main className="flex flex-col items-center space-y-5 mt-10 justify-center">
      
        <h1 className="text-8xl">
          Willem&apos;s <span className="italic font-bold">Spunky</span> Website
        </h1>      
        <h2 className="text-xl max-w-50 text-center">
          Willem is a sophmore at the University of Montana studying integrated lens-based media. 
        </h2>
        


        <div className="max-w-xl">
          <Image
            src="/willemTable.jpeg"
            alt=""
            width={1088}
            height={1088}
            className="w-full h-auto"
          />
        </div>
        <div className="flex flex-wrap space-x-5 justify-center">
          <Image
              src="/nelsBall.jpeg"
              alt=""
              width={4160}
              height={5157}
              className="h-96 w-auto"
            />
            <Image
              src="/willemTwo.jpeg"
              alt=""
              width={3024}
              height={4032}
              className="h-96 w-auto"
            />
            
      </div>
      <div className="flex flex-wrap space-x-5 justify-center">
<Image
              src="/willemBeef.jpeg"
              alt=""
              width={3024}
              height={4032}
              className="h-96 w-auto"
            />
      <Image
              src="/willemBed.jpeg"
              alt=""
              width={4032}
              height={3024}
              className="h-96 w-auto"
            />
      

      </div>
      
    
    </main>



  );
}

