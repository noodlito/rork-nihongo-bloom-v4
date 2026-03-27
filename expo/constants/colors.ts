export interface ThemeColors {
  background: string;
  backgroundAlt: string;
  backgroundGradient: [string, string, string];
  card: string;
  cardAlt: string;
  cardGlass: string;
  text: string;
  textLight: string;
  textMuted: string;
  border: string;
  shadow: string;
  overlay: string;
  sakuraPink: string;
  sakuraPinkLight: string;
  sakuraPinkDark: string;
  lavender: string;
  lavenderLight: string;
  lavenderDark: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  gold: string;
  goldLight: string;
  white: string;
  black: string;
  gridCell: string;
  gridCellSelected: string;
  gridCellCorrect: string;
  gridCellWrong: string;
  gridCellBlocked: string;
  gemBlue: string;
  gemGreen: string;
  gemYellow: string;
  gemRed: string;
  gemPurple: string;
  inputBg: string;
  switchTrack: string;
  headerBg: string;
  accent: string;
  accentLight: string;
  widgetBg: string;
  widgetBorder: string;
}

export const LightColors: ThemeColors = {
  background: '#E6F0F8',
  backgroundAlt: '#D8E8F5',
  backgroundGradient: ['#D8E8F8', '#E6F2FA', '#F0F8FD'],
  card: '#FFFFFF',
  cardAlt: '#F5F8FC',
  cardGlass: 'rgba(255,255,255,0.88)',
  text: '#1A2A3E',
  textLight: '#3D5570',
  textMuted: '#8094A8',
  border: 'rgba(120,160,200,0.2)',
  shadow: 'rgba(40,80,120,0.12)',
  overlay: 'rgba(15, 25, 40, 0.6)',
  sakuraPink: '#4A90C4',
  sakuraPinkLight: '#E8F2FC',
  sakuraPinkDark: '#2E6FA0',
  lavender: '#5B8DB8',
  lavenderLight: '#E8F2FC',
  lavenderDark: '#3A6D94',
  success: '#3EBD6E',
  successLight: '#EDFAF1',
  warning: '#F5A623',
  warningLight: '#FFF6E6',
  error: '#E85454',
  errorLight: '#FFF0F0',
  gold: '#F5A623',
  goldLight: '#FFF8E8',
  white: '#FFFFFF',
  black: '#0A1828',
  gridCell: '#FFFFFF',
  gridCellSelected: '#DCE8F5',
  gridCellCorrect: '#EDFAF1',
  gridCellWrong: '#FFF0F0',
  gridCellBlocked: '#1A2A3E',
  gemBlue: '#5B9BD5',
  gemGreen: '#3EBD6E',
  gemYellow: '#F5A623',
  gemRed: '#E85454',
  gemPurple: '#9B6FD4',
  inputBg: '#F5F8FC',
  switchTrack: '#B8D4E8',
  headerBg: 'transparent',
  accent: '#4A90C4',
  accentLight: '#E8F2FC',
  widgetBg: 'rgba(255,255,255,0.88)',
  widgetBorder: 'rgba(120,160,200,0.22)',
};

export const DarkColors: ThemeColors = {
  background: '#0F1A2A',
  backgroundAlt: '#152438',
  backgroundGradient: ['#0F1A2A', '#152438', '#0F1A2A'],
  card: 'rgba(18, 30, 50, 0.8)',
  cardAlt: 'rgba(22, 36, 58, 0.7)',
  cardGlass: 'rgba(18, 30, 50, 0.75)',
  text: '#E8F0F8',
  textLight: '#B0C4D8',
  textMuted: '#6882A0',
  border: 'rgba(70,120,180,0.18)',
  shadow: 'rgba(0,0,0,0.35)',
  overlay: 'rgba(5, 12, 25, 0.85)',
  sakuraPink: '#5BA8E0',
  sakuraPinkLight: 'rgba(91,168,224,0.15)',
  sakuraPinkDark: '#3D8CC8',
  lavender: '#6AAAE0',
  lavenderLight: 'rgba(106,170,224,0.12)',
  lavenderDark: '#88C0F0',
  success: '#5CC870',
  successLight: 'rgba(92,200,112,0.12)',
  warning: '#FFB84D',
  warningLight: 'rgba(255,184,77,0.12)',
  error: '#F06060',
  errorLight: 'rgba(240,96,96,0.12)',
  gold: '#FFB84D',
  goldLight: 'rgba(255,184,77,0.12)',
  white: '#FFFFFF',
  black: '#060E1A',
  gridCell: 'rgba(15,25,42,0.9)',
  gridCellSelected: 'rgba(91,168,224,0.2)',
  gridCellCorrect: 'rgba(92,200,112,0.15)',
  gridCellWrong: 'rgba(240,96,96,0.15)',
  gridCellBlocked: '#D0DCE8',
  gemBlue: '#6AAAE0',
  gemGreen: '#5CC870',
  gemYellow: '#FFB84D',
  gemRed: '#F06060',
  gemPurple: '#B088E0',
  inputBg: 'rgba(18, 30, 50, 0.6)',
  switchTrack: 'rgba(70,120,180,0.25)',
  headerBg: 'transparent',
  accent: '#5BA8E0',
  accentLight: 'rgba(91,168,224,0.15)',
  widgetBg: 'rgba(20, 35, 60, 0.88)',
  widgetBorder: 'rgba(80,140,210,0.28)',
};

export type AppThemeName = 'ocean' | 'sunset' | 'neon' | 'green';

type ThemeBgOverride = Pick<ThemeColors,
  'background' | 'backgroundAlt' | 'backgroundGradient' | 'headerBg' |
  'widgetBg' | 'widgetBorder' | 'sakuraPink' | 'sakuraPinkLight' | 'sakuraPinkDark' |
  'accent' | 'accentLight' | 'switchTrack' |
  'card' | 'cardAlt' | 'cardGlass' | 'border' | 'inputBg'
>;

export const THEME_BACKGROUNDS: Record<AppThemeName, { light: ThemeBgOverride; dark: ThemeBgOverride }> = {
  ocean: {
    light: {
      background: '#E6F0F8', backgroundAlt: '#D8E8F5', backgroundGradient: ['#D8E8F8', '#E6F2FA', '#F0F8FD'],
      headerBg: 'transparent', widgetBg: 'rgba(255,255,255,0.88)', widgetBorder: 'rgba(130,175,220,0.25)',
      sakuraPink: '#4A90C4', sakuraPinkLight: '#E8F2FC', sakuraPinkDark: '#2E6FA0',
      accent: '#4A90C4', accentLight: '#E8F2FC', switchTrack: '#B8D4E8',
      card: '#FFFFFF', cardAlt: '#F5F8FC', cardGlass: 'rgba(255,255,255,0.88)',
      border: 'rgba(120,160,200,0.2)', inputBg: '#F0F5FA',
    },
    dark: {
      background: '#0F1A2A', backgroundAlt: '#152438', backgroundGradient: ['#0F1A2A', '#152438', '#0F1A2A'],
      headerBg: 'transparent', widgetBg: 'rgba(20, 40, 70, 0.9)', widgetBorder: 'rgba(90,155,215,0.3)',
      sakuraPink: '#5BA8E0', sakuraPinkLight: 'rgba(91,168,224,0.15)', sakuraPinkDark: '#3D8CC8',
      accent: '#5BA8E0', accentLight: 'rgba(91,168,224,0.15)', switchTrack: 'rgba(90,155,215,0.25)',
      card: 'rgba(15, 30, 55, 0.8)', cardAlt: 'rgba(20, 38, 65, 0.7)', cardGlass: 'rgba(15, 30, 55, 0.75)',
      border: 'rgba(70,120,180,0.18)', inputBg: 'rgba(15, 30, 55, 0.6)',
    },
  },
  sunset: {
    light: {
      background: '#FBF0E6', backgroundAlt: '#F5E4D4', backgroundGradient: ['#F8E8D8', '#FDF2EA', '#FFF8F2'],
      headerBg: 'transparent', widgetBg: 'rgba(255,255,255,0.88)', widgetBorder: 'rgba(210,170,130,0.25)',
      sakuraPink: '#D4874A', sakuraPinkLight: '#FFF2E8', sakuraPinkDark: '#B06830',
      accent: '#D4874A', accentLight: '#FFF2E8', switchTrack: '#E0C8A8',
      card: '#FFFFFF', cardAlt: '#FDF6F0', cardGlass: 'rgba(255,255,255,0.88)',
      border: 'rgba(190,155,110,0.2)', inputBg: '#FDF6F0',
    },
    dark: {
      background: '#1E1410', backgroundAlt: '#2A1C14', backgroundGradient: ['#1E1410', '#2A1C14', '#1E1410'],
      headerBg: 'transparent', widgetBg: 'rgba(50, 35, 25, 0.9)', widgetBorder: 'rgba(200,150,90,0.3)',
      sakuraPink: '#E8A060', sakuraPinkLight: 'rgba(232,160,96,0.15)', sakuraPinkDark: '#C88040',
      accent: '#E8A060', accentLight: 'rgba(232,160,96,0.15)', switchTrack: 'rgba(200,150,90,0.25)',
      card: 'rgba(45, 30, 20, 0.8)', cardAlt: 'rgba(55, 38, 25, 0.7)', cardGlass: 'rgba(45, 30, 20, 0.75)',
      border: 'rgba(180,130,70,0.18)', inputBg: 'rgba(45, 30, 20, 0.6)',
    },
  },
  neon: {
    light: {
      background: '#F8E6F0', backgroundAlt: '#F0D8E8', backgroundGradient: ['#F5D8EE', '#FCE8F4', '#FFF0F8'],
      headerBg: 'transparent', widgetBg: 'rgba(255,255,255,0.85)', widgetBorder: 'rgba(215,90,140,0.22)',
      sakuraPink: '#D65B8A', sakuraPinkLight: '#FFE8F2', sakuraPinkDark: '#B8407A',
      accent: '#D65B8A', accentLight: '#FFE8F2', switchTrack: '#E0B0D0',
      card: '#FFFFFF', cardAlt: '#FCF2F8', cardGlass: 'rgba(255,255,255,0.85)',
      border: 'rgba(200,110,160,0.2)', inputBg: '#FCF2F8',
    },
    dark: {
      background: '#1E0F1A', backgroundAlt: '#2C1528', backgroundGradient: ['#1E0F1A', '#2C1528', '#1E0F1A'],
      headerBg: 'transparent', widgetBg: 'rgba(50, 22, 42, 0.9)', widgetBorder: 'rgba(215,90,140,0.3)',
      sakuraPink: '#E868A0', sakuraPinkLight: 'rgba(232,104,160,0.15)', sakuraPinkDark: '#D05088',
      accent: '#E868A0', accentLight: 'rgba(232,104,160,0.15)', switchTrack: 'rgba(215,90,140,0.25)',
      card: 'rgba(42, 18, 35, 0.8)', cardAlt: 'rgba(52, 22, 42, 0.7)', cardGlass: 'rgba(42, 18, 35, 0.75)',
      border: 'rgba(180,70,120,0.18)', inputBg: 'rgba(42, 18, 35, 0.6)',
    },
  },
  green: {
    light: {
      background: '#E8F5EA', backgroundAlt: '#D8ECD9', backgroundGradient: ['#D8EED9', '#E8F5EA', '#F0FAF1'],
      headerBg: 'transparent', widgetBg: 'rgba(255,255,255,0.88)', widgetBorder: 'rgba(100,180,120,0.25)',
      sakuraPink: '#4CAF50', sakuraPinkLight: '#E8F5E9', sakuraPinkDark: '#2E7D32',
      accent: '#4CAF50', accentLight: '#E8F5E9', switchTrack: '#A8D8A0',
      card: '#FFFFFF', cardAlt: '#F2FAF3', cardGlass: 'rgba(255,255,255,0.88)',
      border: 'rgba(90,170,100,0.2)', inputBg: '#F2FAF3',
    },
    dark: {
      background: '#0F1A12', backgroundAlt: '#15261A', backgroundGradient: ['#0F1A12', '#15261A', '#0F1A12'],
      headerBg: 'transparent', widgetBg: 'rgba(20, 45, 25, 0.9)', widgetBorder: 'rgba(80,180,90,0.3)',
      sakuraPink: '#66BB6A', sakuraPinkLight: 'rgba(102,187,106,0.15)', sakuraPinkDark: '#43A047',
      accent: '#66BB6A', accentLight: 'rgba(102,187,106,0.15)', switchTrack: 'rgba(80,180,90,0.25)',
      card: 'rgba(15, 35, 22, 0.8)', cardAlt: 'rgba(20, 42, 28, 0.7)', cardGlass: 'rgba(15, 35, 22, 0.75)',
      border: 'rgba(60,150,80,0.18)', inputBg: 'rgba(15, 35, 22, 0.6)',
    },
  },
};

export const Colors = LightColors;
