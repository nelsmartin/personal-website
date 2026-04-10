import RubiksCube from '@/components/MyRubiksCube';
import AsciiTest from '@/components/AsciiTest';

export default function Page() {
  return (    
        <div className='flex flex-col items-center h-screen'>
            <RubiksCube />
            {/* <AsciiTest /> */}
        </div>
  )
}
