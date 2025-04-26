// @mui
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { BreadcrumbsProps } from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// import { CustomBreadcrumbsProps } from './types';
// import LinkItem from './link-item'

// ----------------------------------------------------------------------

export default function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast,
  sx,
  ...other
}: CustomBreadcrumbsProps) {
  const lastLink = links[links.length - 1].name

  return (
    <Box sx={{ ...sx }}>
      <Stack direction="row" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>
          {/* HEADING */}
          {heading && (
            <Typography variant="h4" gutterBottom>
              {heading}
            </Typography>
          )}

          {/* BREADCRUMBS */}
          {!!links.length && (
            <Breadcrumbs separator={<Separator />} {...other}>
              {links.map((link) => (
                <BreadcrumbsLink
                  key={link.name || ''}
                  link={link}
                  activeLast={activeLast}
                  disabled={link.name === lastLink}
                />
              ))}
            </Breadcrumbs>
          )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}> {action} </Box>}
      </Stack>

      {/* MORE LINK */}
      {!!moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink.map((href) => (
            <Link
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  )
}

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'text.disabled',
      }}
    />
  )
}

// @mui

// ----------------------------------------------------------------------

export type BreadcrumbsLinkProps = {
  name?: string
  href?: string
  icon?: React.ReactElement
}

export interface CustomBreadcrumbsProps extends BreadcrumbsProps {
  heading?: string
  moreLink?: string[]
  activeLast?: boolean
  action?: React.ReactNode
  links: BreadcrumbsLinkProps[]
}

// @mui

// ----------------------------------------------------------------------

type Props = {
  link: BreadcrumbsLinkProps
  activeLast?: boolean
  disabled: boolean
}

export function BreadcrumbsLink({ link, activeLast, disabled }: Props) {
  const { name, href, icon } = link

  const styles = {
    typography: 'body2',
    alignItems: 'center',
    color: 'text.primary',
    display: 'inline-flex',
    ...(disabled &&
      !activeLast && {
        cursor: 'default',
        pointerEvents: 'none',
        color: 'text.disabled',
      }),
  }

  const renderContent = (
    <>
      {icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            display: 'inherit',
            '& svg': { width: 20, height: 20 },
          }}
        >
          {icon}
        </Box>
      )}

      {name}
    </>
  )

  if (href) {
    return (
      <Link href={href} sx={styles}>
        {renderContent}
      </Link>
    )
  }

  return <Box sx={styles}> {renderContent} </Box>
}
