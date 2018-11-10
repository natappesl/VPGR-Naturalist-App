import { StyleSheet, Text, View } from 'react-native';

export const THEME_COLORS = {
  BG: '#fcf7f0',
  PRIMARY: '#001964',
  PRIMARY_HIGHLIGHT: '#0E35A8',
  SECONDARY: '#5A4B42',
  TRANSPARENT_BACKGROUND: 'rgba(52, 52, 52, 0.0)',
  
  HEADING_TEXT: 'white',
  
}
export const Theme = StyleSheet.create({
  background: {
    height: 160,
    width: '100%',
    position: 'absolute',
    top: 150,
  },
  backgroundLogo: {
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: THEME_COLORS.TRANSPARENT_BACKGROUND
  },
  headerContainer: {
    height: 80,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_COLORS.SECONDARY
  },
  listContainer: {
    flex: 10,
    width: '100%',
    backgroundColor: THEME_COLORS.BG,
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
  headerTitle: {
    color: THEME_COLORS.HEADING_TEXT,
    fontSize: 24,
    flex: 5,
    textAlign: 'left',
    marginLeft: 10,
  },
  headerButton: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    textAlignVertical:'center'
  },
});