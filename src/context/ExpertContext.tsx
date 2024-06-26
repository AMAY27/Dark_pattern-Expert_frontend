import { createContext, useState, ReactNode, useContext, useEffect } from "react"
import { PatternData, WebsiteData, extensionPatternDetails } from "../types"

interface ExpertProviderProps {
    children: ReactNode,
}


interface ExpertContextProps {
    patternData : PatternData,
    setPatternData : (patternObject : PatternData)=> void,
    websiteData : WebsiteData,
    setWebsiteData : (websiteObject : WebsiteData)=> void,
    extensionPatterns : extensionPatternDetails[],
    setExtensionPatterns : (extensionObject : extensionPatternDetails[]) => void,
    websiteId :  | null,
    setWebsiteId : (websiteId :  | null)=> void,
    websiteName :  | null,
    setWebsiteName : (websiteName :  | null)=> void,
}

const ExpertContext = createContext<ExpertContextProps | undefined>(undefined)

export const ExpertProvider: React.FC<ExpertProviderProps> = ({ children }) => {
    const [websiteId, setWebsiteId] = useState< | null>(null);
    const [websiteName, setWebsiteName] = useState< | null>(null);
    const [patternData, setPatternData] = useState<PatternData>(()=>{
        const saved = localStorage.getItem('patternData');
        return saved ? JSON.parse(saved) : {
        comments : [],
        createdAt : "",
        createdByExpertId : "",
        description : "",
        detectedUrl : "",
        expertName: "",
        expertVerifications : [],
        id : "",
        isAutoGenerated : true,
        patternImageUrls : [],
        patternType: "",
        patternPhase: "",
        websiteId : "",
        phaseColor : "",
        phaseText : "",
        hoverText : "",
        isPatternExists : false
        }
    });
    const [websiteData, setWebsiteData] = useState<WebsiteData>(()=>{
        const saved = localStorage.getItem('websiteData');
        return saved ? JSON.parse(saved) : {
            baseUrl: "",
            description : "",
            websiteName: "",
            phase : "",
            websiteId : "",
            isCompleted : false,
            patternDetails:[],
            isDarkPatternFree : false,
            expertDetails : [],
            userId : "",
            additionalUrls : [],
            primaryExpertId : "",
            contributorName: "",
            upVotes : [],
            downVotes: [],
            phaseColor : "",
            phaseText : "",
            hoverText : "",
        }
    })
    useEffect(() => {
        localStorage.setItem('websiteData', JSON.stringify(websiteData));
    }, [websiteData]);
    useEffect(() => {
        localStorage.setItem('patternData', JSON.stringify(patternData));
    }, [patternData]);
    const [extensionPatterns, setExtensionPatterns] = useState<extensionPatternDetails[]>([])
    const contextData: ExpertContextProps = {
        websiteId,
        setWebsiteId,
        websiteName,
        setWebsiteName,
        patternData,
        setPatternData,
        websiteData,
        setWebsiteData,
        extensionPatterns,
        setExtensionPatterns
    }

    return(
        <ExpertContext.Provider value={contextData}>{children}</ExpertContext.Provider>
    )
}
export const useExpertContext = () => {
    const context = useContext(ExpertContext);
    if (!context) {
      throw new Error("useExpertContext must be used within an ExpertProvider");
    }
    return context;
}