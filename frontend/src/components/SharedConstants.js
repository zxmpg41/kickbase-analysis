import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'

export const trendIcons = {
  0: <TrendingFlatIcon />,
  1: <TrendingUpIcon sx={{ color: 'green' }} />,
  2: <TrendingDownIcon sx={{ color: 'red' }} />,
}

export const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export const nivoLightTheme = {}

export const nivoDarkTheme = {
  textColor: '#fff',
}

export const minWidths = {
  small: 60,
  medium: 130,
}

export const teamNames = {
  2: 'Bayern München',
  3: 'Borussia Dortmund',
  4: 'Eintracht Frankfurt',
  5: 'SC Freiburg',
  7: 'Bayer Leverkusen 04',
  8: 'Schalke 04',
  9: 'VfB Stuttgart',
  10: 'Werder Bremen',
  11: 'VfL Wolfsburg',
  13: 'FC Augsburg',
  14: 'TSG Hoffenheim',
  15: 'Borussia Mönchengladbach',
  18: 'FSV Mainz 05',
  20: 'Herta BSC Berlin',
  24: 'VfL Bochum',
  28: 'FC Köln',
  40: 'FC Union Berlin',
  42: 'SV Darmstadt 98',
  43: 'RB Leipzig',
  50: 'FC Heidenheim',
}
