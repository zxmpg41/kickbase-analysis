import { DataGrid } from '@mui/x-data-grid'
import { Box, Tooltip } from '@mui/material'

import { currencyFormatter } from './SharedConstants'
import { CustomToolBar, getRelativeTime } from './utils'

import data from '../data/market.json'
import mw_changes from '../data/mw_changes.json'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import Cookies from 'js-cookie'

data = data.filter((entry) => new Date(entry.expiration) - new Date() > 0)

function MarketTable() {
  const user = Cookies.get('user')

  const columns = [
    {
      field: 'teamLogo',
      headerName: '',
      width: 50,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <img src={params.value} alt={params.value} width="40" />
      ),
    },
    {
      field: 'position',
      headerName: 'Position',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'lastName',
      headerName: 'Nachname',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'points',
      headerName: 'Punkte',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: ({ row }) =>
        `${row.averagePoints} / ${row.points.toLocaleString('de')}`,
    },
    {
      field: 'price',
      headerName: 'Preis',
      type: 'number',
      flex: 2,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: 'font-tabular-nums',
    },
    {
      field: 'oneDayAgo',
      headerName: 'Heute',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: (params) => {
        if (params.value < 0) return ['font-tabular-nums', 'negative-number']
        else if (params.value > 0)
          return ['font-tabular-nums', 'positive-number']
        else return 'font-tabular-nums'
      },
    },
    {
      field: 'twoDaysAgo',
      headerName: 'Gestern',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: (params) => {
        if (params.value < 0) return ['font-tabular-nums', 'negative-number']
        else if (params.value > 0)
          return ['font-tabular-nums', 'positive-number']
        else return 'font-tabular-nums'
      },
    },
    {
      field: 'threeDaysAgo',
      headerName: 'Vorgestern',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: (params) => {
        if (params.value < 0) return ['font-tabular-nums', 'negative-number']
        else if (params.value > 0)
          return ['font-tabular-nums', 'positive-number']
        else return 'font-tabular-nums'
      },
    },
    {
      field: 'date',
      headerName: 'Ablaufdatum',
      flex: 2,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: ({ value }) => getRelativeTime(value),
    },
    {
      field: 'offer',
      headerName: 'Angebot',
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ formattedValue }) => {
        const style = {
          backgroundImage: 'linear-gradient(white, white)',
          borderRadius: '50%',
        }
        const content =
          formattedValue.name === 'Kevin' ? (
            <CheckCircleIcon
              sx={{
                color: 'green',
                ...style,
              }}
            />
          ) : (
            <CancelIcon sx={{ color: 'darkred', ...style }} />
          )
        return (
          <Box
            sx={{
              ':hover': {
                cursor: 'pointer',
              },
            }}
          >
            <Tooltip
              title={currencyFormatter.format(Number(formattedValue.value))}
              arrow
            >
              {content}
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  const getPreviousValues = (playerId) => {
    let changesOfPlayer = [...mw_changes].find(
      (changeObj) => changeObj.player_id === playerId
    )
    return changesOfPlayer
  }

  const rows = data.map((row, i) => {
    const previousValues = getPreviousValues(row.player_id)
    return {
      id: i,
      teamLogo: process.env.PUBLIC_URL + '/images/' + row.team_id + '.png',
      position: row.position,
      lastName: row.last_name,
      price: row.price,
      oneDayAgo: previousValues?.one_day_ago || 0,
      twoDaysAgo: previousValues?.two_days_ago || 0,
      threeDaysAgo: previousValues?.three_days_ago || 0,
      date: new Date(row.expiration),
      points: row.points,
      averagePoints: row.averagePoints,
      offer: user === 'kevin' && { value: row.offerValue, name: row.offerName },
    }
  })

  return (
    <Box
      sx={{
        '& .negative-number': { color: 'red' },
        '& .positive-number': { color: 'green' },
        '& .positive-number::before': { content: '"+"' },
      }}
    >
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 20, 50]}
        initialState={{
          sorting: { sortModel: [{ field: 'date', sort: 'asc' }] },
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        columnVisibilityModel={{
          offer: user === 'kevin',
        }}
        slots={{
          toolbar: CustomToolBar,
        }}
      />
    </Box>
  )
}

export default MarketTable
