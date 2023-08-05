import TimeAgo from 'javascript-time-ago'
import de from 'javascript-time-ago/locale/de'
import { GridToolbarQuickFilter, GridToolbarContainer } from '@mui/x-data-grid'
import mw_changes from '../data/mw_changes.json'
import { Tooltip, Box } from '@mui/material'
import { currencyFormatter, trendIcons } from './SharedConstants'

export const getRelativeTime = (date) => {
  TimeAgo.addDefaultLocale(de)
  const timeAgo = new TimeAgo('de-DE')
  return timeAgo.format(new Date(date), 'round')
}

export const CustomToolBar = () => (
  <GridToolbarContainer
    sx={{ display: 'flex', width: '100%', justifyContent: 'start', pl: 2 }}
  >
    <GridToolbarQuickFilter debounceMs={500} />
  </GridToolbarContainer>
)

export const getPreviousValues = (playerId) => {
  let changesOfPlayer = mw_changes.find(
    (changeObj) => changeObj.player_id === playerId
  )
  return changesOfPlayer
}

export const ValueChangeTooltip = ({ trend, playerId }) => {
  const { one_day_ago, two_days_ago, three_days_ago } =
    getPreviousValues(playerId)
  return (
    <Tooltip
      arrow
      title={`${currencyFormatter.format(
        Number(one_day_ago)
      )} / ${currencyFormatter.format(
        Number(two_days_ago)
      )} / ${currencyFormatter.format(Number(three_days_ago))}`}
    >
      <Box>{trendIcons[trend]}</Box>
    </Tooltip>
  )
}
