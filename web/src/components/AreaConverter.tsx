import { InputAdornment, TextField as MuiTextField } from '@mui/material'
import { areaConversions } from 'src/constants/projects'
import { sqmtConverter } from 'src/util/sqmtConverter'
import NoBorderDropDown from './comps/noBorderDropDown'

export const AreaConverter = ({ formik, hideField, fieldName,textPrimaryName, textSecondaryName, dropDownPrimaryName, dropdownSecondaryName }) => {
  const onConverterAdd = ({
    primary,
    primaryUnit,
    secondary,
    secondaryUnit,
    formik,
  }) => {

    const primaryValue = formik.values[textPrimaryName] 
    ? sqmtConverter(formik.values[textPrimaryName], formik.values[dropDownPrimaryName]) 
    : 0
  const secondaryValue = formik.values[textSecondaryName]
    ? sqmtConverter(formik.values[textSecondaryName], formik.values[dropdownSecondaryName])
    : 0
  const value = primaryValue + secondaryValue
  value && formik.setFieldValue(fieldName, value) && hideField(false)
  }



  return (
    <div className="mt-3 mb-6">
      <label htmlFor="area" className="label font-regular text-sm">
        Sqmt Converter
      </label>
      <div className="">
   
        <MuiTextField


id={fieldName}
name={textPrimaryName}
value={formik.values[textPrimaryName]}
onChange={formik.handleChange}
          className={`w-[100%] bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10 p-0 `}
          size="small"
          InputProps={{
            style: {
              height: '2rem',
              padding: '0px',
              borderRadius: '6px',
            },
            endAdornment: (
              <InputAdornment
                position="start"
                style={{
                  height: '32px',
                  background: '#E5E7EB',
                  paddingLeft: '5px',
                  marginRight: '0px',
                }}
              >
                <NoBorderDropDown
                  name="relation1"
                  label=""
                  className="input  min-w-[110px] h-[32px]"
                  onChange={({ value }) => {
                    formik.setFieldValue('areaDropDownPrimary', value)
                  }}
                  value={formik.values.areaDropDownPrimary}
                  options={areaConversions}
                />
              </InputAdornment>
            ),
          }}
          label=""
          type="text"

        />
        <MuiTextField

id={`${fieldName}Secondary`}



name={textSecondaryName}
value={formik.values[textSecondaryName]}
onChange={formik.handleChange}

        
          className={`w-full bg-grey-lighter text-grey-darker border border-[#cccccc] rounded-md h-10  mt-1 p-0`}
          size="small"
          InputProps={{
            style: {
              height: '2rem',
              padding: '0px',
              margin: '0px',
              borderRadius: '6px',
        
            },
            endAdornment: (
              <InputAdornment
                position="start"
                className="text-gray-900 bg-gray-200"
                style={{
                  height: '32px',
                  background: '#E5E7EB',
                  paddingLeft: '5px',
                  marginRight: '0px',
                }}
              >
                <NoBorderDropDown
                  name="areaDropdownSecondary"
                  label=""
                  className="input  min-w-[110px] h-[32px]"
                  onChange={({ value }) => {
                    formik.setFieldValue('areaDropdownSecondary', value)
                  }}
                  value={formik.values.areaDropdownSecondary}
                  options={areaConversions}
                />
              </InputAdornment>
            ),
          }}
          label=""

          type="text"
        />
      </div>
      <button
        className="mb-2 md:mb-0 float-right bg-[#57c0d0] px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white hover:shadow-lg hover:bg-green-500"
        type="button"
        onClick={() =>
          onConverterAdd({
            primary: formik.values.areaTextPrimary,
            primaryUnit: formik.values.areaDropDownPrimary,
            secondary: formik.values.areaTextSecondary,
            secondaryUnit: formik.values.areaDropdownSecondary,
            formik,
          })
        }
      >
        Convert to Sqmt
      </button>
    </div>
  )
}
