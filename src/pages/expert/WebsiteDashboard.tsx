import React, { useEffect, useState, useContext, useCallback } from 'react'
import { useExpertContext } from '../../context/ExpertContext'
import { getPatternsData, getSpecificPattern, getSpecificWebsite, stringAvatar } from '../../services/expertServices';
import Navbar from '../../components/expert/Navbar';
import PatternCard from '../../components/expert/PatternCard';
import PatternAdditionForm from '../../components/expert/PatternAdditionForm';
import PatternDetailsComponent from '../../components/expert/PatternDetailsComponent';
import { PatternData } from '../../types';
import { setRedirectCallback } from "../../utils/AxiosHelper";
import AuthContext from "../../context/AuthContext1";
import withExpertAuth from '../../hoc/withExpertAuth';
import { toast } from "react-toastify";
import { Avatar, IconButton, Tooltip} from '@mui/material';
import { IoMdArrowDropdown } from "react-icons/io";
import LoadingPatternCard from '../../components/expert/LoadingPatternCard';
import LoadingCards from '../../components/expert/LoadingCards';
import PublishForm from '../../components/expert/PublishForm';
import {
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { patternSupportLinks } from '../../utils/patternSupportLinks';
import { Info as InfoIcon } from "@mui/icons-material";


const WebsiteDashboard = () => {
    const authContext = useContext(AuthContext);
    useEffect(() => {
        setRedirectCallback(() => {
          authContext?.logoutUser();
        });
        return () => {
          setRedirectCallback(null);
        };
    }, [authContext]);
    const websiteId = sessionStorage.getItem("websiteId")
    const websiteName = sessionStorage.getItem("websiteName");
    const { websiteData, setWebsiteData } = useExpertContext();
    const { setExtensionPatterns } = useExpertContext();
    const [patterns, setPatterns] = useState<any[]>([]);
    const [filteredArray, setFilteredArray] = useState<any[]>([]);
    const experId = localStorage.getItem("userId");
    const expertName = localStorage.getItem("userName");
    const token = localStorage.getItem("authToken");
    const [patternTypes, setPatternTypes] = useState<any[]>([])
    const [experts, setExperts] = useState<any[]>([])
    const [phases, setPhases] = useState<any[]>([])
    const [filters, setFilters] = useState({
        patternType: '',
        expertName: '',
        phase: ''
    });
    const [isPublishBtnDisabled, setIsPublishBtnDisabled] = useState<boolean>(false);
    const [isPatternformOpen, setIsPatternformOpen] = useState(false);
    const [isPatternModalOpen, setIsPatternModalOpen] = useState(false)
    const {  setPatternData } = useExpertContext();
    const [zindex, setZindex ] = useState(false)
    const z_index = zindex ? "z-[-20]" : "z-[0]"
    const bgForPublishBtn = isPublishBtnDisabled ? "bg-gray-300" : "bg-green-500";
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCardLoading, setIsCardLoading] = useState<boolean>(false);
    const [isPublishOpen, setIsPublishOpen] = useState<boolean>(false);
    const [displayEmptyPatternsText, setDisplayEmptyPatternsText] = useState<boolean>(false);
    const [supportUrl, setSupportUrl] = useState<string>("https://www.deceptive.design/types/fake-scarcity");

    const getWebsiteData = useCallback(async ()=> {
      if(websiteId){
        try {
          const webData = await getSpecificWebsite(websiteId)
          if(webData){
            setWebsiteData(webData)
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(`Error: ${error.message}`);
          } else {
            toast.error("An unknown error occurred.");
          }
        }
      }
      // eslint-disable-next-line
    },[websiteId]) 

    const getPatterns = useCallback( async () => {
        setPatterns([]);
        let data : any = [];
        if(websiteId && token){
            try {
              data = await getPatternsData(websiteId);
              data.length === 0 ? setDisplayEmptyPatternsText(true) : setDisplayEmptyPatternsText(false)
              data.forEach((pattern:PatternData)=>{
                if (pattern.isAutoGenerated===true) pattern.expertName="AI Model"
              })
              setPatterns(data);
              const patternPhases = data.map((item : PatternData)=>item.patternPhase);
              !patternPhases.includes("InProgress") ? setIsPublishBtnDisabled(false) : setIsPublishBtnDisabled(true);
              const uniquePatternTypes = data
                .map((item : PatternData) => item.patternType)
                .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);

              const uniqueExperts = data
                .map((item : PatternData) => item.expertName)
                .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);

              const uniquePhases = data
                .map((item : PatternData) => item.patternPhase)
                .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
              setPatternTypes(uniquePatternTypes);
              setExperts(uniqueExperts);
              setPhases(uniquePhases);
              setIsLoading(false);
              setIsCardLoading(false);
            } catch (error) {
              if (error instanceof Error) {
                toast.error(`Error: ${error.message}`);
              } else {
                toast.error("An unknown error occurred.");
              }
            }
        }
        // eslint-disable-next-line
    },[websiteId, token])

    useEffect(()=>{
        getPatterns();
        getWebsiteData();
    },[getPatterns, getWebsiteData]);

    const filterArray = useCallback(() => {
      setFilteredArray([]);
      const filtered = patterns.filter((item) => {
        return (
            (!filters.patternType || item.patternType === filters.patternType) &&
            (!filters.expertName || item.expertName.includes(filters.expertName)) &&
            (!filters.phase || item.patternPhase === filters.phase)
        );
      });
      setFilteredArray(filtered);
    },[filters, patterns])

    useEffect(() => {
        filterArray();
    }, [filterArray]);

    const handleSelectOption = (filterType : string,option: string) => {
      setFilteredArray([]);
      setFilters(prevFilters => ({
        ...prevFilters,
        [filterType]: option
      }));
    };

    const handleMessageFromContentScript = (event:MessageEvent) => {
      if (event.source === window && event.data.action === 'sendDataToReactApp') {
        const dataFromContentScript = event.data;
        console.log(dataFromContentScript);
        setExtensionPatterns(dataFromContentScript.result.patternType);
      }
    }

    useEffect(()=>{
      window.addEventListener('message', handleMessageFromContentScript);
      return () => {
        window.removeEventListener('message', handleMessageFromContentScript);
      };
      // eslint-disable-next-line
    },[]);

    const openForm = () =>{
      window.postMessage({action : 'getDataFromStorage', keys: ['patternType']},'*')
      setIsPatternformOpen(true);
      setZindex(true)
    }
    const closeFrom = () =>{
      setIsPatternformOpen(false);
      setIsCardLoading(true);
      getPatterns();
      setZindex(false)
    };
    const openPatternModal = async (id:String) => {
      setZindex(true)
      try {
        if(websiteId && token){
          const patternObj  = await getSpecificPattern(id , websiteId);
          setPatternData(patternObj);
          setIsPatternModalOpen(true)
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unknown error occurred.");
        }
      }  
    }
    const closePatternModal = () => {
      setZindex(false)
      setIsPatternModalOpen(false);
      setIsCardLoading(true);
      getPatterns();
    }

    const handlePublish = async() => {
      setIsPublishOpen(true);
      setZindex(true);
    }

    const handlePublishClose = async() => {
      setIsPublishOpen(false)
      setZindex(false);
      setIsLoading(true);
      getPatterns();
      getWebsiteData();
    }

    const patternSupportUrl = (supportUrl:string) => {
      setSupportUrl(supportUrl);
    }

  return (
    <div>
        <Navbar/>
        {isLoading ? <LoadingPatternCard/> :
        <div>
        <PatternAdditionForm isOpen={isPatternformOpen} onClose={closeFrom} />
        <PatternDetailsComponent isOpen={isPatternModalOpen} onClose={closePatternModal} expertId={experId ? experId : ""}/>
        <PublishForm isOpen={isPublishOpen} onClose={handlePublishClose} patterns={patterns} expertId={experId ? experId : ""} websiteId={websiteId? websiteId: ""}/>
        <div className='sm:mx-24 h-screen flex flex-col sm:flex-row gap-0 sm:gap-4 sm:mt-8'>
          <div className={`sm:w-1/3 shadow-xl sm:rounded-2xl bg-white h-fit py-6 px-4 ${z_index} sm:sticky sm:top-0`}>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl sm:text-2xl font-bold text-blue-500'>{websiteName}</h2>
              <div className='mx-2 mt-2 sm:mt-0 flex justify-end'>
                <button onClick={openForm} className='sm:hidden px-4 py-2 rounded-full bg-blue-500 text-white text-2xl'>+</button>
                {websiteData.phase === "InProgress" ? <button onClick={openForm} className='hidden sm:block px-8 py-2 rounded-md bg-blue-500 text-white'>Contribute a Pattern</button> : null}
              </div>
            </div>
            <Link to={websiteData.baseUrl} target="_blank" className='text-blue-500'>
              <p className="truncate ...">{websiteData.baseUrl}...</p>
              <OpenInNewIcon sx={{ width: "20px", height: "20px" }} />
            </Link>
            <div className='mt-3'>
              <div className='w-full bg-gray-200 py-2 px-2 mt-2 rounded-lg'>
                <h2 className='font-bold'>Description</h2>
                <p>{websiteData.description}</p>
              </div>
              <div className='w-full my-2 space-y-2'>
                <h2 className='font-bold'>Filters</h2>
                <div className='flex items-center'>
                  <div className='mx-2 text-sm sm:text-base'>
                    <label htmlFor="patternlink" className='mb-2 block text-md font-medium'>Contributor</label>
                    <select id="orient" 
                      className='p-1 sm:p-2 bg-transparent border-2 rounded-md sm:w-40'
                      onChange={(e) => handleSelectOption('expertName', e.target.value)}
                      >
                      <option value="">All</option>
                      {experts.map((expert)=>(
                          expert === expertName ? <option value={expert}>You</option> : <option value={expert}>{expert}</option>
                      ))}
                    </select>
                  </div>
                  <div className='mx-2 text-sm sm:text-base'>
                    <label htmlFor="patternlink" className='mb-2 block text-md font-medium'>Pattern Type</label>
                    <select id="orient" 
                      className='p-1 sm:p-2 bg-transparent border-2 rounded-md sm:w-40'
                      onChange={(e) => handleSelectOption('patternType', e.target.value)}
                      >
                      <option value="">All</option>
                      {patternTypes.map((type)=>(
                          <option value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className='w-full rounded-lg mt-2 p-2'>
                <h2 className='font-bold'>Contributor</h2>
                {websiteData.expertDetails.map((expert)=>(
                  <div className='flex items-center my-2'><Avatar {...stringAvatar(expert.name)} className='mx-2'/>{expert.name}</div>
                ))}
              </div>
              <h2 className='font-bold py-2 px-2'>Dark Pattern References</h2>
              <div className='flex bg-transparent border-2 rounded-xl px-4'>
                <select id="orient" 
                    className='p-2 rounded-md w-full cursor-pointer'
                    onChange={(e) => patternSupportUrl(e.target.value)}
                    >
                    {patternSupportLinks.map((url)=>(
                        <option value={url.patternUrl}>{url.patternName}</option>
                    ))}
                </select>
                <IconButton
                  aria-label="feedback-details"
                  size="small"
                  color="primary"
                  href={supportUrl}
                  target="_blank"
                >
                  <InfoIcon />
                </IconButton>
              </div>
            </div>
          </div>
          <div className='flex-1 sm:h-auto px-4 sm:px-12 sm:pb-4'>
            {!isCardLoading && displayEmptyPatternsText ? <div className='bg-gray-100 h-40 flex justify-center items-center w-full rounded-xl mr-6 my-6'><p className=' text-2xl'>No patterns detected</p></div> : !isCardLoading ? 
            filteredArray.map((pattern : PatternData,index)=>(
              <div className={`lg:grid grid-cols-1`}>
                <PatternCard patternData={pattern} loggedInExpert = {experId ? experId : ""} openModal = {()=> openPatternModal(pattern.id)} z_index = {z_index}/>
              </div>
            ))  : <LoadingCards/>
            }
          </div>
        </div>
        </div>}
    </div>
  )
}

export default withExpertAuth(WebsiteDashboard)