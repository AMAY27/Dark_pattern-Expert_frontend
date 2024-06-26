import React, { useState } from 'react'
import { WebsiteAdditionProps, WebsiteDetailsFormForExperts } from '../../types'
import { addWebsiteForCertificationforExpert } from '../../services/expertServices'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdClose  } from 'react-icons/io';

const WebsiteAdditionForm:React.FC<WebsiteAdditionProps>= ({isOpen, onClose, handleWebsiteSubmitSuccess, id}) => {

    const [webSiteDetails, setWebsiteDetails] = useState<WebsiteDetailsFormForExperts>({
        userId: id,
        baseUrl: "",
        websiteName: "",
        description: "",
        primaryExpertId : id
    })
    const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false)

    const handleCloseClick = () =>{
        onClose();
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        setWebsiteDetails(p=>({...p,[e.target.name] : e.target.value}))
    }

    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        setIsSubmitClicked(true)
        if(id){
            const response = await addWebsiteForCertificationforExpert(webSiteDetails ); 
            if(response.status===201){
                handleWebsiteSubmitSuccess();
                toast.success("Website added successfully", {
                    position: toast.POSITION.TOP_CENTER
                });
                setIsSubmitClicked(false);
                setWebsiteDetails({
                    baseUrl : id,
                    userId : "",
                    websiteName : "",
                    description : "",
                    primaryExpertId : id
                })
            }
            else{
                toast.error("Error while adding pattern, try again", {
                    position: toast.POSITION.TOP_CENTER
                });
                setIsSubmitClicked(false)
            }
        }
    }

    if(!isOpen) return null;
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
        <div className='bg-white px-4 lg:px-8 lg:rounded-lg relative z-30 py-8 h-auto w-full lg:w-3/5 overflow-auto'>
        <form onSubmit={handleSubmit}>
            <div className="space-y-2 lg:space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className='text-base lg:text-lg text-blue-500 font-bold leading-7'>Contribute the website which uses dark patterns</h2>
                    <IoMdClose
                        onClick={handleCloseClick}
                        className="hover:bg-blue-200 rounded-lg p-2 text-4xl"
                    />
                </div>
                <div className='lg:grid lg:grid-cols-3 space-y-2 sm:space-y-0 lg:space-x-4'>
                    <div className='col-span-1'>
                        <label htmlFor="patterntype" className='mb-2 block text-md font-medium'>Website Name *</label>
                        <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-300'>
                            <input 
                                type='text' 
                                name='websiteName'
                                required 
                                id='websitename' 
                                value={webSiteDetails.websiteName}
                                onChange={handleChange}
                                className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6' placeholder="Enter Website Name"/>
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <label htmlFor="patternlink" className='mb-2 block text-md font-medium'>Link *</label>
                        <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-300'>
                            <input 
                                type='text' 
                                name='baseUrl' 
                                id='websitelink'
                                required
                                value={webSiteDetails.baseUrl}
                                onChange={handleChange} 
                                className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6' placeholder="Enter Link"/>
                        </div>
                    </div>
                </div>
                <div className='col-span-full'>
                    <label htmlFor="patterndescription" className='mb-2 block text-md font-medium'>Description *</label>
                    <textarea 
                        name="description" 
                        id="websitedescription"
                        value={webSiteDetails.description}
                        onChange={handleChange}
                        required
                        className='block w-full rounded-md border-0 lg:py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset focus:ring-green-300' placeholder='Short description for Website'></textarea>
                </div>
                            {/* <div className='col-span-full border-2 rounded-md flex flex-col items-center justify-center'>
                                <p className='mb-4 block text-md font-medium pt-4'>Select images from the pattern list from extension</p>
                                {/* <label htmlFor="images" className='mb-2 block text-md font-medium p-2 bg-gray-100 mb-4 rounded-md cursor-pointer'>
                                    <span className="text-blue-500">Choose File</span>
                                    <input
                                        type='file'
                                        name='images'
                                        id='images'
                                        accept='image/*'
                                        onChange={handleImageChange}
                                        multiple 
                                        className='hidden'
                                    />
                                </label>
                                {images.length > 0 && (
                                    <div className="my-2 px-6 grid grid-cols-4 gap-4 w-full">
                                        {images.map((image, index) => {
                                        //const file = formData.get('files') as File
                                        return(
                                            <div key={index} className={`relative ${z_index}`}>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded-md border-2 border-gray-200 opacity-50 cursor-pointer"
                                                    onClick={()=>handleAddedImageClick(image)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageDelete(index)}
                                                    className="absolute top-0 right-0 text-black-500 cursor-pointer bg-gray-200 rounded-full shadow-xl hover:bg-blue-300"
                                                >
                                                    <IoMdClose
                                                        className="p-1 text-2xl font-bold"
                                                    />
                                                </button>
                                            </div>)
                                        })}
                                    </div>
                                )}
                            </div> */}
                            <div className='flex justify-center'>
                                <button className='flex items-center justify-center lg:col-span-2 border-[1px] border-blue-500 hover:bg-blue-500 hover:text-white p-3 rounded-lg w-full' type='submit' disabled={isSubmitClicked}>{isSubmitClicked ? ( 
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>) : "Submit Website"}
                                </button>
                            </div>
                        </div>
                    </form>
        </div>
    </div>
  )
}

export default WebsiteAdditionForm