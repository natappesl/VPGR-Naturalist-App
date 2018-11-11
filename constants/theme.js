import { StyleSheet, Text, View } from 'react-native';

export const THEME_COLORS = {
  BG: '#fcf7f0',
  PRIMARY: '#001964',
  PRIMARY_HIGHLIGHT: '#0E35A8',
  SECONDARY: '#5A4B42',
  TRANSPARENT: 'rgba(52, 52, 52, 0.0)',
  TRANSPARENT_HALF: 'rgba(52, 52, 52, 0.5)',
  
  HEADING_TEXT: 'white',
  
}
export const Theme = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: THEME_COLORS.BG,
  },
  backgroundLogo: {
    position: 'absolute',
    top: 100,
    width: '100%',
    height: 160,
    resizeMode: 'contain',
  },
  containerContainer: {
    flex: 1,
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
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.TRANSPARENT,
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
    backgroundColor: THEME_COLORS.TRANSPARENT,
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
    backgroundColor: THEME_COLORS.SECONDARY,
    borderTopWidth: 0,
    borderColor: THEME_COLORS.SECONDARY,
  },
  searchInput: {
    flex: 1,
    width: '90%',
    backgroundColor: THEME_COLORS.BG,
  },
});