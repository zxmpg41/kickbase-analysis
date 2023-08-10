import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid'
import React, { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { NumericFormat } from 'react-number-format'
import Paper from '@mui/material/Paper'

import { currencyFormatter, minWidths, teamNames } from './SharedConstants'

import data from '../data/taken_players.json'
import users from '../data/users.json'
import { CustomToolBar, ValueChangeTooltip } from './utils'
import Cookies from 'js-cookie'

function LineupPlanner() {
  const user = Cookies.get('user')
  const userData = users.find((ele) => ele.name.toLowerCase() === user)
  const managers = [...new Set(data.map((item) => item.user))]

  const [manager, setManager] = useState(managers[0])
  const [balance, setBalance] = useState(0)
  const [selectedValue, setSelectedValue] = useState(0)
  const [selection, setSelection] = useState([])
  const [playersOnPositions, setPlayersOnPositions] = useState({
    0: 0,
    1: 0,
    2: 0,
  })

  const filteredData = data.filter((e) => e.user === manager)

  const possibleFormations = [
    [3, 4, 3],
    [4, 4, 2],
    [3, 5, 2],
    [4, 5, 1],
    [3, 6, 1],
    [5, 2, 3],
    [4, 2, 4],
    [5, 3, 2],
    [4, 3, 3],
    [5, 4, 1],
  ].sort()

  const playableFormations = possibleFormations.filter((formation) => {
    for (var i = 0; i < 3; i++) {
      if (!(formation[i] <= playersOnPositions[i])) return false
    }
    return formation
  })

  useEffect(() => {
    const sum = filteredData
      .filter((x) => selection.includes(x.player_id))
      .reduce((a, x) => a + x.market_value, 0)
    setSelectedValue(sum)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection])

  useEffect(() => {
    var updatedPlayersOnPositions = { 0: 0, 1: 0, 2: 0 }
    filteredData.forEach((player) => {
      if (selection.includes(player.player_id)) return
      if (player.position === 'ABW') updatedPlayersOnPositions[0]++
      else if (player.position === 'MF') updatedPlayersOnPositions[1]++
      else if (player.position === 'ANG') updatedPlayersOnPositions[2]++
    })
    setPlayersOnPositions(updatedPlayersOnPositions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, manager])

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
      field: 'buyPrice',
      headerName: 'Kaufpreis',
      type: 'number',
      flex: 2,
      minWidth: minWidths.medium,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      headerAlign: 'center',
      cellClassName: 'font-tabular-nums',
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
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
    },
  ]

  const rows = filteredData.map((row, i) => ({
    id: row.player_id,
    playerId: row.player_id,
    teamLogo: import.meta.env.BASE_URL + '/images/' + row.team_id + '.png',
    teamName: teamNames[row.team_id],
    position: row.position,
    firstName: row.first_name,
    lastName: row.last_name,
    buyPrice: row.buy_price === 0 ? row.market_value : row.buy_price,
    marketValue: row.market_value,
    turnover: row.buy_price === 0 ? 0 : row.market_value - row.buy_price,
    manager: row.user,
    trend: row.trend,
  }))

  const onChange = (e) => {
    setManager(e.target.value)
    if (e.target.value.toLowerCase() === user) {
      setBalance(userData.budget)
    }
  }

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item>
          <FormControl sx={{ margin: 1 }}>
            <InputLabel>Manager</InputLabel>
            <Select value={manager} label="Manager" onChange={onChange}>
              {managers.map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sx={{ margin: 1 }}>
          <NumericFormat
            value={balance}
            label="Kontostand"
            thousandSeparator="."
            decimalSeparator=","
            allowNegative
            customInput={TextField}
            decimalScale={0}
            onValueChange={(e) => {
              setBalance(Number(e.value))
            }}
            suffix={' €'}
          />
        </Grid>
        <Grid item sx={{ margin: 1 }}>
          <TextField
            label="Nach Verkauf"
            value={currencyFormatter.format(balance + selectedValue)}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item key={0} xs={1}>
          <Paper
            elevation={3}
            sx={{
              background: 'lightblue',
              margin: 1,
              padding: '3px 0px',
              textAlign: 'center',
            }}
          >
            {playersOnPositions[0]}-{playersOnPositions[1]}-
            {playersOnPositions[2]}
          </Paper>
        </Grid>
        {possibleFormations.map((formation, i) => {
          return (
            <Grid item key={i} xs={1}>
              <Paper
                elevation={3}
                sx={{
                  background: playableFormations.includes(formation)
                    ? 'lightgreen'
                    : 'indianred',
                  margin: 1,
                  padding: '3px 0px',
                  textAlign: 'center',
                }}
              >
                {formation[0]}-{formation[1]}-{formation[2]}
              </Paper>
            </Grid>
          )
        })}
      </Grid>
      <DataGrid
        sx={{ marginTop: 1 }}
        width={window.innerWidth}
        checkboxSelection
        autoHeight
        rows={rows}
        columns={columns}
        pageSizeOptions={[18]}
        initialState={{
          sorting: { sortModel: [{ field: 'marketValue', sort: 'desc' }] },
          pagination: { paginationModel: { page: 0, pageSize: 18 } },
        }}
        columnVisibilityModel={{
          teamName: false,
        }}
        slots={{
          toolbar: CustomToolBar,
        }}
        onRowSelectionModelChange={(s) => {
          setSelection(s)
        }}
      />
    </>
  )
}

export default LineupPlanner
