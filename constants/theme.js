import { StyleSheet, Text, View, Dimensions } from 'react-native';
const d = Dimensions.get('window');

const BUTTON_FONT_SIZE = 24;
const BUTTON_WIDTH = 320;
const BUTTON_HEIGHT = 60;
const BUTTON_FONT_WEIGHT = 'bold';
const BUTTON_FONT_STYLE = 'normal';
const BUTTON_MARGIN = 20;
const BUTTON_PADDING = 10;
const BUTTON_BORDER_RADIUS = 10;

export const THEME_COLORS = {
  BG: '#fcf7f0',
  PRIMARY: '#001964',
  PRIMARY_HIGHLIGHT: '#0E35A8',
  SECONDARY: '#5A4B42',
  TRANSPARENT: 'rgba(255, 255, 255, 0.0)',
  TRANSPARENT_HALF: 'rgba(255, 255, 255, 0.4)',
  
  HEADING_TEXT: 'white',
  CONTENT_TEXT: 'white',
  
}

export const Theme = StyleSheet.create({
  sideButton: {
    flex: 3,
    maxHeight: BUTTON_HEIGHT,
    backgroundColor: THEME_COLORS.SECONDARY,
    width: BUTTON_WIDTH,
    padding: BUTTON_PADDING,
    margin: BUTTON_MARGIN,
  },

  buttonPressed: {
    maxHeight: BUTTON_HEIGHT - 10,
    width: BUTTON_WIDTH - 10,
    margin: BUTTON_MARGIN + 5,
  },

  leftButton: {
    alignSelf: 'flex-start',
    marginLeft: 0,
    borderTopRightRadius: BUTTON_BORDER_RADIUS,
    borderBottomRightRadius: BUTTON_BORDER_RADIUS,
  },

  rightButton: {
    alignSelf: 'flex-end',
    marginRight: 0,
    borderTopLeftRadius: BUTTON_BORDER_RADIUS,
    borderBottomLeftRadius: BUTTON_BORDER_RADIUS,
  },

  buttonText: {
    flex: 1,
    textAlignVertical: 'center',
    fontSize: BUTTON_FONT_SIZE,
    color: THEME_COLORS.BG,
    fontStyle: BUTTON_FONT_STYLE,
    fontWeight: BUTTON_FONT_WEIGHT,
  },

  leftButtonText: {
    textAlign: 'right',
  },

  rightButtonText: {
    textAlign: 'left',
  },

  buttonTextPressed: {
    fontSize: BUTTON_FONT_SIZE - 4,
  },

  rightIconButton: {
    flex: 0,
    width:60,
    marginLeft: BUTTON_MARGIN,
    alignSelf: 'center',
  },

  background: {
    top: 0,
    left: 0,
    width: d.width,
    height: d.height,
    position: 'absolute',
    backgroundColor: THEME_COLORS.BG,
  },
  backgroundLogo: {
    flex: 0,
    position: 'absolute',
    top: 100,
    width: d.width,
    height: 160,
    resizeMode: 'contain',
  },
  containerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_COLORS.BG,
  },
  contentContainer: {
    flex: 10,
    width: '100%',
    backgroundColor: THEME_COLORS.TRANSPARENT
  },
  headerContainer: {
    width: d.width,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.TRANSPARENT,
  },
  reverseRow: {
    flexDirection: 'row-reverse',
  },
  headerTitle: {
    color: THEME_COLORS.HEADING_TEXT,
    fontSize: 24,
    flex: 5,
    textAlign: 'left',
    marginLeft: 10,
  },
  listContainer: {
    flex: 10,
    width: '100%',
    borderTopWidth: 1,
    backgroundColor: THEME_COLORS.TRANSPARENT_HALF,
    
  },
  listContent: {
    flex:1,
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
  },
  listContentImage: {
    flex: 1,
  },
  listContentView: {
    flex: 10,
    paddingLeft: 5,
  },
  listContentTitle: {
    fontWeight: 'bold',
  },
  listContentSubtitle: {
    fontStyle: 'italic'
  },
  loadingContainer: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_COLORS.TRANSPARENT,
    borderTopWidth: 0,
    borderColor: THEME_COLORS.SECONDARY,
  },
  searchInput: {
    flex: 1,
    width: '90%',
    backgroundColor: THEME_COLORS.BG,
  },
  shadow: {
    shadowColor: 'rgba(0,0,0, 0.5)', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 5, //IOS
  },
});