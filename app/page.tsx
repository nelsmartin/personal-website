import Image from "next/image";


export default function Home() {
  return (
    <main className="flex flex-col items-center space-y-5 mt-10">
        <h1 className="text-8xl">
          Willem&apos;s <span className="italic font-bold">Spunky</span> Website
        </h1>      
        <h2 className="text-xl max-w-50 text-center">
          Willem is a sophmore at the University of Montana studying integrated lens-based media. 
        </h2>
        <Image
              src="/willemTable.jpeg"
              alt=""
              width={1088}
              height={1088}
              className="h-100 w-auto"
            />

        <div className="flex flex-row space-x-5">
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
      <div className="flex flex-row space-x-5">
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

