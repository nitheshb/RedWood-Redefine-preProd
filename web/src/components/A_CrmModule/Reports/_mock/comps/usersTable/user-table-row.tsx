import { useCallback, useState } from 'react'

// @mui
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'

// hooks
// types
// components
// import { ConfirmDialog } from 'src/components/custom-dialog'
// import CustomPopover, { usePopover } from 'src/components/custom-popover'
// import Iconify from 'src/components/iconify'
// import Label from 'src/components/label'
// import { useBoolean } from 'src/hooks/use-boolean'
// import { IUserItem } from 'src/types/user'

//
import { computeTotal } from 'src/util/computeCsTotals'
import { prettyDate } from 'src/util/dateConverter'

import ConfirmDialog from '../confirm-dialog'
import { useBoolean } from '../hook-form/use-boolean'
import Iconify from '../iconify'
import Label from '../Label'

import CustomPopover from './custom-popover'
import UserQuickEditForm, { IUserItem } from './user-quick-edit-form'
// import UserQuickEditForm from './user-quick-edit-form'

// ----------------------------------------------------------------------

type Props = {
  selected: boolean
  onEditRow: VoidFunction
  row: IUserItem
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
}

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  console.log('rows', row)
  const {
    area,
    name,
    avatarUrl,
    company,
    role,
    status,
    email,
    projName,
    pId,
    phoneNumber,
    Plot_area,
    sqft_rate,
    plotCS,
    addChargesCS,
    T_review,
    T_balance,
    unit_no,
    customerDetailsObj,
    super_built_up_area,
    Date,
    by,
  } = row
  // const legalCharge = addChargesCS?.filter((d)=> (d?.myId ==="83d81de3-1294-4e96-84bf-07294011b15e") )[0]['charges']
  const legalCharge = addChargesCS?.reduce((sum, item) => {
    if (item.myId === '83d81de3-1294-4e96-84bf-07294011b15e') {
      return sum + Number(item.charges)
    }
    return sum
  }, 0)
  const clubHouseCharges = addChargesCS?.reduce((sum, item) => {
    if (item.myId === 'eceb862f-3977-4e0f-a256-8c372af8cd71') {
      return sum + Number(item.charges)
    }
    return sum
  }, 0)
  const maintenanceCharges = addChargesCS?.reduce((sum, item) => {
    if (item.myId === '27ee5bf1-0a4e-4b01-90db-39f23b7af804') {
      return sum + Number(item.charges)
    }
    return sum
  }, 0)
  const infraCharges = addChargesCS?.reduce((sum, item) => {
    if (item.myId === '38bdfbbf-e4df-4b83-b7c1-086f084f8696') {
      return sum + Number(item.charges)
    }
    return sum
  }, 0)

  const partACost =
    plotCS?.reduce(function (_this, val) {
      return _this + val.TotalNetSaleValueGsT
    }, 0) || 0

  const partBCost =
    addChargesCS?.reduce(
      (partialSum, obj) =>
        partialSum +
        Number(
          computeTotal(obj, super_built_up_area || area?.toString()?.replace(',', ''))
        ),
      0
    ) || 0

  const confirm = useBoolean()

  const quickEdit = useBoolean()

  const popover = usePopover()

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={customerDetailsObj?.customerName1}
            // src={}
            sx={{ mr: 2 }}
          />

          <ListItemText
            primary={customerDetailsObj?.customerName1}
            secondary={projName}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />

        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          {unit_no}
        </TableCell>
        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (status === 'booked' && 'success') ||
              (status === 'agreement_pipeline' && 'warning') ||
              (status === 'banned' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (status === 'active' && 'success') ||
              (status === 'pending' && 'warning') ||
              (status === 'banned' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>
        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          {prettyDate(Date)}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          ₹{partACost?.toLocaleString('en-IN')}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        ₹{infraCharges?.toLocaleString('en-IN')}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        ₹{clubHouseCharges?.toLocaleString('en-IN')}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        ₹{maintenanceCharges?.toLocaleString('en-IN')}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        ₹{legalCharge?.toLocaleString('en-IN')}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        ₹{(partACost + partBCost)?.toLocaleString('en-IN')}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        ₹{sqft_rate?.toLocaleString('en-IN')}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        ₹{sqft_rate?.toLocaleString('en-IN')}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        ₹{T_review?.toLocaleString('en-IN')}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        ₹{T_balance?.toLocaleString('en-IN')}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{by}</TableCell>

        {/* <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color={quickEdit.value ? 'inherit' : 'default'}
              onClick={quickEdit.onTrue}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      <UserQuickEditForm
        currentUser={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue()
            popover.onClose()
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow()
            popover.onClose()
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  )
}

// ----------------------------------------------------------------------

type ReturnType = {
  onClose: VoidFunction
  open: HTMLElement | null
  onOpen: (event: React.MouseEvent<HTMLElement>) => void
  setOpen: React.Dispatch<React.SetStateAction<HTMLElement | null>>
}

export function usePopover(): ReturnType {
  const [open, setOpen] = useState<HTMLElement | null>(null)

  const onOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget)
  }, [])

  const onClose = useCallback(() => {
    setOpen(null)
  }, [])

  return {
    open,
    onOpen,
    onClose,
    setOpen,
  }
}
