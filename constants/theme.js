import { StyleSheet, Text, View, Dimensions } from 'react-native';
const d = Dimensions.get('window');
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
    width: '100%',
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
    flex: 1,
    minHeight: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-end',
    alignItems: 'baseline',
    backgroundColor: THEME_COLORS.TRANSPARENT,
  },
  headerTitle: {
    color: THEME_COLORS.HEADING_TEXT,
    fontSize: 24,
    flex: 5,
    textAlign: 'left',
    marginLeft: 10,
  },
  smallHeaderButtonIcon: {
    flex:1,
    padding: 20,
    margin: 10,
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