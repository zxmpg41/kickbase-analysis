import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'

import { currencyFormatter } from './SharedConstants'
import { CustomToolBar, getRelativeTime } from './utils'

import data from '../data/market.json'
import mw_changes from '../data/mw_changes.json'

data = data.filter((entry) => new Date(entry.expiration) - new Date() > 0)

function MarketTable() {
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
        slots={{
          toolbar: CustomToolBar,
        }}
      />
    </Box>
  )
}

export default MarketTable
