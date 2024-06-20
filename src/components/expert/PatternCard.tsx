import React, {useState} from 'react'
import withAuth from '../../hoc/withAuth';
import { PatternCardProps } from '../../types';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const PatternCard: React.FC<PatternCardProps> = ({ loggedInExpert, openModal, patternData, z_index }) => {
    let name = loggedInExpert === patternData.createdByExpertId ? 'You' : patternData.expertName 
    const inputDate = new Date(patternData.createdAt);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate: string = inputDate.toLocaleDateString('en-US', options);

  return (
    <div className={`col-span-1 py-1 sm:rounded-xl shadow-xl bg-white lg:bg-[#F9F9DF] mb-4 ${z_index}`} id="pattern-card" key={patternData.id}>
      <div className='flex items-center justify-between mt-2 px-3'>
        <h1 className={`text-lg sm:text-xl`}>{patternData.patternType}</h1>
        <div className='flex justify-between py-1 my-2'>
          <button className={`px-8 py-1 bg-blue-500 rounded-lg shadow-lg text-white`} onClick={openModal}>View Details</button>
        </div>
      </div>
      <div className='flex justify-between my-2 px-3'>
        {patternData.isAutoGenerated===true ? <p className='text-gray-400 italic font-serif '>Created By : AI Model</p> : <p className='text-gray-400 italic font-serif '>Detected By : {name}</p> }
        <div className='flex'>
          <p className='italic font-serif text-gray-400'>{formattedDate}</p>
        </div>
      </div>
      <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} showIndicators={false} autoPlay={false} interval={3000} className={`border-t-[1px] my-2 border-gray-400 relative ${z_index}`}>
        {patternData.patternImageUrls.map((img)=>(
          <div className={`w-full ${z_index} p-2`}>
            <img src={img} alt='pattern snapshots'/>
          </div>
        ))}
      </Carousel>  
    </div>
  )
}

export default withAuth(PatternCard)