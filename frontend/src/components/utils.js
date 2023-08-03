import TimeAgo from 'javascript-time-ago'
import de from 'javascript-time-ago/locale/de'
import { GridToolbarQuickFilter, GridToolbarContainer } from '@mui/x-data-grid'

export const getRelativeTime = (date) => {
  TimeAgo.addDefaultLocale(de)
  const timeAgo = new TimeAgo('de-DE')
  return timeAgo.format(new Date(date), 'round')
}

export const CustomToolBar = () => (
  <GridToolbarContainer
    sx={{ display: 'flex', width: '100%', justifyContent: 'start' }}
  >
    <GridToolbarQuickFilter debounceMs={500} />
  </GridToolbarContainer>
)
