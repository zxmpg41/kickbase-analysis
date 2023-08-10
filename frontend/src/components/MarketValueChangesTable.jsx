import { DataGrid } from '@mui/x-data-grid'

import { currencyFormatter, minWidths, teamNames } from './SharedConstants'
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
      field: 'teamName',
    },
    {
      field: 'firstName',
      headerName: 'Vorname',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      minWidth: minWidths.medium,
    },
    {
      field: 'lastName',
      headerName: 'Nachname',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      minWidth: minWidths.medium,
    },
    {
      field: 'marketValue',
      headerName: 'Marktwert',
      type: 'number',
      flex: 2,
      minWidth: minWidths.medium,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: 'font-tabular-nums',
    },
    {
      field: 'averagePoints',
      headerName: '€ / Ø',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: minWidths.medium,
      valueGetter: ({ row }) => {
        if (row.averagePoints === 0) {
          return '0'
        }
        return currencyFormatter.format(
          Number(row.marketValue / row.averagePoints)
        )
      },
    },
    {
      field: 'oneDayAgo',
      headerName: 'Heute',
      type: 'number',
      flex: 2,
      minWidth: minWidths.medium,
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
      minWidth: minWidths.medium,
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
      minWidth: minWidths.medium,
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
      field: 'manager',
      headerName: 'Manager',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      minWidth: minWidths.medium,
    },
  ]

  const rows = data.map((row, i) => ({
    id: i,
    teamLogo: import.meta.env.BASE_URL + '/images/' + row.team_id + '.png',
    teamName: teamNames[row.team_id],
    firstName: row.first_name,
    lastName: row.last_name,
    oneDayAgo: row.one_day_ago,
    twoDaysAgo: row.two_days_ago,
    threeDaysAgo: row.three_days_ago,
    marketValue: row.market_value,
    manager: row.manager,
    averagePoints: row.averagePoints,
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
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        columnVisibilityModel={{
          teamName: false,
        }}
        slots={{
          toolbar: CustomToolBar,
        }}
      />
    </Box>
  )
}

export default MarketValueChangesTable
