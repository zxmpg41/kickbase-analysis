import { DataGrid } from '@mui/x-data-grid'

import { currencyFormatter } from './SharedConstants'

import data from '../data/turnovers.json'
import { CustomToolBar } from './utils'

function TurnoversTable() {
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
      field: 'buyPrice',
      headerName: 'Kaufpreis',
      type: 'number',
      flex: 3,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: 'font-tabular-nums',
    },
    {
      field: 'sellPrice',
      headerName: 'Verkaufspreis',
      type: 'number',
      flex: 3,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: 'font-tabular-nums',
    },
    {
      field: 'turnover',
      headerName: 'Gewinn/Verlust',
      type: 'number',
      flex: 3,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: 'font-tabular-nums',
    },
    {
      field: 'manager',
      headerName: 'Manager',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
    },
    {
      field: 'buyer',
      headerName: 'Käufer',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
    },
    {
      field: 'date',
      headerName: 'Datum',
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
      flex: 2,
    },
  ]

  const rows = data.map((row, i) => ({
    id: i,
    teamLogo: process.env.PUBLIC_URL + '/images/' + row[1].team_id + '.png',
    firstName: row[1].first_name,
    lastName: row[1].last_name,
    buyPrice: row[0].value,
    sellPrice: row[1].value,
    turnover: row[1].value - row[0].value,
    manager: row[0].user,
    buyer: row[1].trade_partner,
    date: row[1].date,
  }))

  return (
    <DataGrid
      width={window.innerWidth}
      autoHeight
      rows={rows}
      columns={columns}
      pageSizeOptions={[10, 20, 50]}
      initialState={{
        sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
        pagination: { paginationModel: { page: 1, pageSize: 10 } },
      }}
      slots={{
        toolbar: CustomToolBar,
      }}
    />
  )
}

export default TurnoversTable
