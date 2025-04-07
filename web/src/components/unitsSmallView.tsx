/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { MenuItem, styled } from '@mui/material'
const CustomMenuItem = styled(MenuItem)(() => ({
  fontSize: '0.85rem',
}))

const UnitsSmallViewCard = ({ kind, feedData, bg,  setSelUnitDetails,
  setShowCostSheetWindow,
  setSelMode, }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selOptionIs, setSelOptionIs] = useState("")
  const [bgColor, setBgColor] = useState("")
  const [fontColor, setFontColor] = useState("#000")

  const open = Boolean(anchorEl)
  const [sliderInfo, setSliderInfo] = useState({
    open: false,
    title: '',
    sliderData: {},
  })

  useEffect(()=>{
    if(kind.status==="available"){
      setBgColor("#fff")
    }else if(["booked", 'agreement_pipeline', 'ATS', 'agreement', 'allotment','possession', 'construction', 'registered'].includes(kind.status)){
      setBgColor("#CCFBF1")

    }else if(["blocked", 'customer_blocked', 'management_blocked'].includes(kind.status)){
      setBgColor("#e9e9e9")
    }else {
      setBgColor("#F7EAD0")
      setFontColor("#B76E00")
    }
  }, [kind])
  const handleSliderClose = () => {
    setSliderInfo({
      open: false,
      title: '',
      sliderData: {},
    })
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('was this from here' )
    setAnchorEl(event.currentTarget)
  }


  return (
    <div
      className={` min-w-[145px] z-10 flex flex-col  max-w-md p-2 mx-auto my-0 rounded-lg cursor-pointer border border-black-600 shadow-radius shadow-xl`}
      style={{ backgroundColor: bgColor, color: fontColor}}
    >
      <div className="flex flex-row items-center justify-between">
        <h3 className="m-0 ml-2 text-sm font-semibold  leading-tight tracking-tight  border-0 border-gray-200 sm:text-1xl md:text-1xl ">
          {kind?.unit_no}

        </h3>
        <span className="flex flex-row items-center justify-between mr-2">
          <span className="text-[10px] font-">
            {kind?.facing || ''}

          </span>
        </span>

      </div>
      <div className="flex flex-row justify-between px-2">
        <span className="flex flex-row items-center justify-between mr-2">
          <span className="text-[10px] font-">
            {kind?.super_built_up_area || kind?.area || 0} sqft

          </span>
        </span>
        <span className="flex flex-row items-center justify-between ">
          <span className="text-[10px] font-">
            {kind?.size || kind?.size || 0}

          </span>
        </span>


      </div>


    </div>
  )
}

export default UnitsSmallViewCard
