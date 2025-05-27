/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import { Box, Menu, MenuItem, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useAuth } from 'src/context/firebase-auth-context'
import { auth } from 'src/context/firebaseConfig'
import { logout as logoutAction } from 'src/state/actions/user'
import ModuleSwitchDrop from '../A_SideMenu/modulesSwitchDrop'
import NotificationHomeDropdown from '../comps/NotificationHeader/NotificationHome'
import { GlobalSearchBar } from './GlobalSearchBar'

const HeadNavBar2 = ({ selModule, setSelModule, setViewable }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const [filteredUnits, setFilteredUnits] = useState([])

  const { user, logout } = useAuth()
  const dispatch = useDispatch()
  const makeFilterFun = (id, viewModule) => {
    // ''Marketing','Sales', 'CRM', 'Legal', 'Finance', 'HR'
    setSelModule(viewModule)
    console.log('i was clicked', id, viewModule)
  }
  const handleClose = async (menuItem) => {
    setAnchorEl(null)
    if (menuItem === 'Logout') {
      await logout()
      dispatch(logoutAction())
    }
  }

  const openUserAccount = () => {
    handleClose(null)
    setViewable('userProfile')
  }


  return (
    <div className="sticky top-0 z-50">
      <div className="flex items-center flex-shrink-0 h-14 px-2  pl-0 bg-white border-b ">
        <span
          style={{ marginLeft: '10px' }}
          className="relative z-10 flex items-center text-md font-extrabold leading-none text-black select-none pl-0 ml-4"
        >
          REDEFINE ERP .
        </span>
        <section className="">
          <ModuleSwitchDrop
            type={selModule}
            id={'Status'}
            setStatusFun={makeFilterFun}
            filteredUnits={filteredUnits}
            pickedValue={selModule}
          />
        </section>
        <GlobalSearchBar />
        <button className="flex items-center justify-center h-10 px-4 ml-auto "></button>
        <button className="flex items-center justify-center h-10 text-sm font-medium "></button>
        <NotificationHomeDropdown />
        <Box
          sx={{
            cursor: 'pointer',
          }}
          display="flex"
          component="span"
          onClick={handleClick}
        >
          <button className="relative ml-2 text-sm focus:outline-none group  items-center justify-center h-10 text-sm font-medium">
            <div className=" w-9 h-9 mr-2 rounded-full ">
              <img
                src={auth?.currentUser?.photoURL || '/avatar_1.png'}
                alt=""
                className=" bottom-0 rounded-full border-2 border-white w-[40px] h-[40px]"
              />
            </div>
          </button>
          <Box display="flex" flexDirection="column" mr={2}>
            <Typography variant="body2">{user?.displayName}</Typography>
            <Typography variant="caption" className="text-gray-500">
              {user?.roles?.length > 0
                ? user?.roles[0] == 'admin'
                  ? 'Super User'
                  : user?.roles[0]
                : user?.role?.length > 0
                ? user?.role[0] == 'admin'
                  ? 'Super User'
                  : user?.role[0]
                : user?.department}
            </Typography>
          </Box>
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => openUserAccount()}>My account</MenuItem>
          <MenuItem onClick={() => handleClose('Logout')}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default HeadNavBar2
