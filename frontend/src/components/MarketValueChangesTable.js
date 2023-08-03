import { DataGrid } from '@mui/x-data-grid'

import { currencyFormatter } from './SharedConstants'
import { CustomToolBar } from './utils'
import { Box } from '@mui/material'
import data from '../data/mw_changes.json'

function MarketValueChangesTable() {
  const columns = [
    {
      field: 'teamLogo',
      headerName: 'Team',
      width: 50,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <img src={params.value} alt={params.value} width="40" />
      ),
    },
    {
      field: 'firstName',
      headerName: 'Vorname',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
    },
    {
      field: 'lastName',
      headerName: 'Nachname',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
    },
    {
      field: 'marketValue',
      headerName: 'Marktwert',
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
      flex: 2,
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
      flex: 2,
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
      flex: 2,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: (params) => {
        if (params.value < 0) return ['font-tabular-nums', 'negative-number']
        else if (params.value > 0)
          return ['font-tabular-nums', 'positive-number']
        else return 'font-tabular-nums'
      },
    },
  ]

  const rows = data.map((row, i) => ({
    id: i,
    teamLogo: process.env.PUBLIC_URL + '/images/' + row.team_id + '.png',
    firstName: row.first_name,
    lastName: row.last_name,
    oneDayAgo: row.one_day_ago,
    twoDaysAgo: row.two_days_ago,
    threeDaysAgo: row.three_days_ago,
    marketValue: row.market_value,
  }))

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
          sorting: { sortModel: [{ field: 'oneDayAgo', sort: 'desc' }] },
          pagination: { paginationModel: { page: 1, pageSize: 10 } },
        }}
        slots={{
          toolbar: CustomToolBar,
        }}
      />
    </Box>
  )
}

export default MarketValueChangesTable
