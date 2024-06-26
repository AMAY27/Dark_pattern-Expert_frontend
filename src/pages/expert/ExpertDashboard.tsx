import React, { useEffect, useState, useContext, useCallback } from 'react'
import { getWebsites, getKpiDetails, stringAvatar, addUpVoteToWebsite, addDownVoteToWebsite } from '../../services/expertServices'
import Navbar from '../../components/expert/Navbar';
import { useNavigate } from 'react-router-dom';
import { setRedirectCallback } from "../../utils/AxiosHelper";
import AuthContext from "../../context/AuthContext1";
import withExpertAuth from '../../hoc/withExpertAuth';
import { toast } from "react-toastify";
import { ExpertKpi, WebsiteData } from '../../types';
import { Tooltip, Avatar } from '@mui/material';
import KpiCard from '../../components/expert/KpiCard';
import LoadingExpertDashboard from '../../components/expert/LoadingExpertDashboard';
import WebsiteAdditionForm from '../../components/expert/WebsiteAdditionForm';
import PatterndivforWebsitCarousel from '../../components/expert/PatterndivforWebsitCarousel';
import ImageSlides from '../../components/expert/ImageSlides';
import { FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown , FaThumbsUp  } from "react-icons/fa6";
import { MdOutlineAddTask } from "react-icons/md";
import DarkTypes from '../../components/expert/DarkTypes';
import { useExpertContext } from '../../context/ExpertContext'

const ExpertDashboard : React.FC = () => {
    const authContext = useContext(AuthContext);
    useEffect(() => {
        setRedirectCallback(() => {
          authContext?.logoutUser();
        });
    
        return () => {
          setRedirectCallback(null);
        };
    }, [authContext]);
    const [websites, setWebsites] = useState<WebsiteData[]>([])
    const {websiteData, setWebsiteData} = useExpertContext()
    const [loadingWebsiteIds, setLoadingWebsiteIds] = useState<string[]>([]);
    const [kpiData, setKpiData] = useState<ExpertKpi[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [zindex, setZindex ] = useState(false)
    const z_index = zindex ? "z-[-30]" : "z-[0]";
    const id  = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName")
    const authToken = localStorage.getItem("authToken")
    const getWebsiteData = useCallback( async () => {
        setIsLoading(true);
        setWebsites([]);
        try {
            if(id && authToken){
                let websites : any = []
                websites = await getWebsites(id);
                let kpis:ExpertKpi[] = await getKpiDetails(id);
                setKpiData(kpis);
                setWebsites(websites);
                setIsLoading(false)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error: ${error.message}`);
              } else {
                toast.error("An unknown error occurred.");
            }
        }
    },[id,authToken])

    useEffect(()=>{
        getWebsiteData();
    },[getWebsiteData])

    const handleClick = (id:string, websiteName: string, website:WebsiteData) => {
        sessionStorage.setItem("websiteId", id);
        sessionStorage.setItem("websiteName", websiteName);
        setWebsiteData(website)
        navigate('/expert/website')
    }
    const handleClose = () => {
        setIsFormOpen(false);
        setZindex(false);
        //getWebsiteData();
    }

    const handleWebsiteSubmitSuccessful = () => {
        setIsFormOpen(false);
        setZindex(false);
        getWebsiteData();
    }

    const handleOpen = () => {
        setZindex(true);
        setIsFormOpen(true)
    }

    const handleUpVoteClick = async (websiteId:string, userId:string) => {
        setLoadingWebsiteIds(prevIds => [...prevIds, websiteId]);
        const response = await addUpVoteToWebsite(websiteId, userId)
        if (response) {
            setWebsites(prevData =>
              prevData.map(website =>
                website.websiteId === websiteId ? { ...website, upVotes: response.websiteUpvotes, downVotes: response.websiteDownvotes} : website
              )
            );
        }
        setLoadingWebsiteIds(prevIds => prevIds.filter(id => id !== websiteId));
    }

    const handleDownVoteClick = async (websiteId:string, userId:string) => {
        setLoadingWebsiteIds(prevIds => [...prevIds, websiteId]);
        const response = await addDownVoteToWebsite(websiteId, userId)
        if (response) {
            setWebsites(prevData =>
              prevData.map(website =>
                website.websiteId === websiteId ? { ...website, downVotes: response.websiteDownvotes, upVotes: response.websiteUpvotes} : website
              )
            );
        }
        setLoadingWebsiteIds(prevIds => prevIds.filter(id => id !== websiteId));
    }


  return (
    <>
        <Navbar/>
        {isLoading ? <LoadingExpertDashboard/> :
        <>
        <WebsiteAdditionForm isOpen={isFormOpen} onClose={handleClose} handleWebsiteSubmitSuccess={handleWebsiteSubmitSuccessful} id={id ?id: ""}/>
        <div className='grid grid-cols-1 md:grid-cols-3 md:mt-8 mt-4 md:mx-5 xl:mx-20'>
            <div className={`col-span-1 md:col-span-2 md:mx-8 ${z_index}`}>
                <div className={`shadow-xl bg-white mb-4 p-2 sm:p-4 md:rounded-xl`}>
                    <div className={`flex justify-center items-center`}>
                        <div>
                            <Avatar {...stringAvatar(userName?userName:"")}/>
                        </div>
                        <div className='ml-2 sm:ml-6'>
                            <p className='hidden sm:block mb-2 flex justify-center'>Start with contributing websites and application which follows deceptive patterns</p>
                            <button className='flex items-center text-base sm:text-lg space-x-2 px-6 py-1 border-[1px] border-blue-500 rounded-xl text-md hover:bg-blue-500 hover:text-white' onClick={handleOpen}><MdOutlineAddTask/> Contribute</button>
                        </div>
                    </div>
                </div>
                <p className='flex justify-center text-sm sm:text-base font-bold'>Websites contributed by users at Digithics</p>
                <div className='grid lg:grid-cols-2 md:gap-2 my-2 bg:white'>
                    {websites.map((website, index)=>(
                        <div key={website.websiteId} 
                            className={`p-3 my-1 shadow-md bg-white md:rounded-xl border-blue-300 lg:col-span-1`}  
                        >
                            <div>
                                <div className="flex items-center space-x-4">
                                    <Avatar {...stringAvatar(website.contributorName)}/>
                                    <div>
                                        <h2 className='text-gray-400 font-bold'>{website.contributorName}</h2>
                                        <p className='text-gray-400 font-italic'>Contributor</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <h2 className='font-bold text-base sm:text-xl text-blue-500'>{website.websiteName}</h2>
                                </div>
                                <div className='w-60 pb-2 md:pb-0'><p className="truncate ... text-blue-500">{website.baseUrl}</p></div>
                                <div className="flex justify-end items-center pt-2 text-sm sm:text-base">
                                    <div className='flex justify-center space-x-1 md:space-x-4'>
                                        <button 
                                            className={`flex space-x-2 items-center p-2 font-bold rounded-2xl border-2 border-gray-300`} 
                                            onClick={() => handleUpVoteClick(website.websiteId, id || "")}
                                            disabled={loadingWebsiteIds.includes(website.websiteId)}
                                        >
                                            {website.upVotes.includes(userName || "") ? <FaThumbsUp className='text-blue-500'/> : <FaRegThumbsUp className='text-gray-400'/>}
                                            <p className='text-gray-400'>{website.upVotes.length}</p>
                                        </button>
                                        <button 
                                            className={`flex space-x-2 items-center p-2 font-bold rounded-2xl border-2 border-gray-300`} 
                                            onClick={() => handleDownVoteClick(website.websiteId, id || "")}
                                            disabled={loadingWebsiteIds.includes(website.websiteId)}
                                        >
                                            {website.downVotes.includes(userName || "") ? <FaThumbsDown className='text-blue-500'/> : <FaRegThumbsDown className='text-gray-400'/>}
                                            <p className='text-gray-400'>{website.downVotes.length}</p>
                                        </button>
                                    </div>
                                </div>
                                {/* {website.patternDetails.length !== 0 ? 
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                            {website.patternDetails.map((pattern)=>(
                                                <PatterndivforWebsitCarousel
                                                    description={pattern.description}
                                                    expertName={pattern.expertName}
                                                    patternImageUrls={pattern.patternImageUrls}
                                                    patternType={pattern.patternType}
                                                    z_index={z_index}
                                                />
                                            ))}
                                        </div>
                                    : 
                                    <div className='bg-gray-100 flex justify-center items-center mt-4 py-6 px-8 w-full'>
                                        <h2 className='text-blue-500 '>No Pattern detetcted yet for this website</h2>
                                    </div>
                                } */}
                                <button 
                                    className='w-full my-4 py-1 px-2 border-2 border-blue-500 rounded-xl font-bold hover:bg-blue-300'
                                    onClick={() => handleClick(website.websiteId, website.websiteName, website)}
                                >Explore Deceptive patterns in website
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`col-span-1 gap-4 mx-4 xl:mx-8 bg:white ${z_index}`}>
                <DarkTypes isDisplayedOnDashboard={true}/>
                <div className='hidden md:grid grid-cols-2 gap-2'>
                    {kpiData.map((kpi:ExpertKpi) => (
                        <KpiCard title={kpi.title} count={kpi.count} color={kpi.color}/>
                    ))}
                </div>
            </div>
        </div>
        </>}
    </>
  )
}

export default withExpertAuth(ExpertDashboard)