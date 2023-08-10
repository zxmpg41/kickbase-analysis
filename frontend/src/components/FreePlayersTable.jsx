import { DataGrid } from '@mui/x-data-grid'

import { currencyFormatter, minWidths, teamNames } from './SharedConstants'

import data from '../data/free_players.json'
import { CustomToolBar, ValueChangeTooltip } from './utils'

function FreePlayersTable() {
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
      field: 'position',
      headerName: 'Position',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: minWidths.small,
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
      field: 'trend',
      headerName: 'Trend',
      flex: 1,
      minWidth: minWidths.small,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <ValueChangeTooltip
            trend={params.value}
            playerId={params.row.playerId}
          />
        )
      },
    },
    {
      field: 'points',
      headerName: 'Punkte',
      headerAlign: 'center',
      flex: 1,
    },
  ]

  const rows = data.map((row, i) => ({
    id: i,
    playerId: row.player_id,
    teamLogo: import.meta.env.BASE_URL + '/images/' + row.team_id + '.png',
    teamName: teamNames[row.team_id],
    firstName: row.first_name,
    lastName: row.last_name,
    marketValue: row.market_value,
    points: row.points,
    position: row.position,
    trend: row.trend,
  }))

  return (
    <DataGrid
      width={window.innerWidth}
      autoHeight
      rows={rows}
      columns={columns}
      pageSizeOptions={[10, 20, 50]}
      initialState={{
        sorting: { sortModel: [{ field: 'marketValue', sort: 'desc' }] },
        pagination: { paginationModel: { page: 0, pageSize: 10 } },
      }}
      columnVisibilityModel={{
        teamName: false,
      }}
      slots={{
        toolbar: CustomToolBar,
      }}
    />
  )
}

export default FreePlayersTable
