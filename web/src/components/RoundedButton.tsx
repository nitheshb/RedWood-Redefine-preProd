import { Button } from '@mui/material'

// py-2 px-8
const StyledRoundedButton = ({ isCategoryMatched, children, ...props }) => (
  <Button
    sx={{
      borderRadius: '1rem',
      padding: '0.5rem 2rem',
      border: `1px solid #9D01A3`,
      color: `#484848`,
      fontWeight: 600,
      height: '1.8rem',
      fontSize: '0.75rem',
      backgroundColor: isCategoryMatched ? `#E0DDEE` : '#fff',
      margin: '0 0.25rem',
      '&:hover': {
        backgroundColor: `#E0DDEE`,
        border: `1px solid #9D01A3`,
      },
    }}
    {...props}
  >
    {children}
  </Button>
)

export default StyledRoundedButton
