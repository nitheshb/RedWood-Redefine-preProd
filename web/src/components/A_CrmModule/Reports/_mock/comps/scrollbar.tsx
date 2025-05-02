import { memo, forwardRef } from 'react'

// @mui
import Box from '@mui/material/Box'
import { alpha, styled, Theme, SxProps } from '@mui/material/styles'
import SimpleBar, { Props } from 'simplebar-react'

// @mui

//
// import { StyledRootScrollbar, StyledScrollbar } from './styles'
// import { ScrollbarProps } from './types'

// ----------------------------------------------------------------------

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ children, sx, ...other }, ref) => {
    const userAgent =
      typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      )

    if (isMobile) {
      return (
        <Box ref={ref} sx={{ overflow: 'auto', ...sx }} {...other}>
          {children}
        </Box>
      )
    }

    return (
      <StyledRootScrollbar>
        <StyledScrollbar
          scrollableNodeProps={{
            ref,
          }}
          clickOnTrack={false}
          sx={sx}
          {...other}
        >
          {children}
        </StyledScrollbar>
      </StyledRootScrollbar>
    )
  }
)

export default memo(Scrollbar)

// ----------------------------------------------------------------------

export interface ScrollbarProps extends Props {
  children?: React.ReactNode
  sx?: SxProps<Theme>
}

// ----------------------------------------------------------------------

export const StyledRootScrollbar = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
}))

export const StyledScrollbar = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[600], 0.48),
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
}))
