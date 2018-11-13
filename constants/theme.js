// Styling reference: https://revelry.co/styles-in-react-native/

import { StyleSheet, Text, View, Dimensions } from 'react-native';
const d = Dimensions.get('window');

export const dimensions = {
  h: d.height,
  w: d.width,
}
export const ButtonConst = {
  fontSize: 24,
  width: 320,
  height: 60,
  fontWeight: 'bold',
  fontStyle: 'normal',
  margin: 20,
  padding: 10,
  borderRadius: 10,
}
export const Colors = {
  bg: '#fcf7f0',
  primary: '#001964',
  primaryLight: '#0E35A8',
  secondary: '#5A4B42',
  transparent: 'rgba(255, 255, 255, 0.0)',
  transparentSemi: 'rgba(255, 255, 255, 0.4)',
  
  headingText: 'white',
  contentText: 'white',
  
}
export const BackgroundTheme =  StyleSheet.create({
  main: {
    top: 0,
    left: 0,
    width: dimensions.w,
    height: dimensions.h,
    position: 'absolute',
    backgroundColor: Colors.bg,
  },
  logo: {
    flex: 0,
    position: 'absolute',
    top: 100,
    width: dimensions.w,
    height: 160,
    resizeMode: 'contain',
  },
});
export const ButtonTheme = StyleSheet.create({
  side: {
    flex: 3,
    maxHeight: ButtonConst.height,
    backgroundColor: Colors.secondary,
    width: ButtonConst.width,
    padding: ButtonConst.padding,
    margin: ButtonConst.margin,
  },

  pressed: {
    maxHeight: ButtonConst.height - 10,
    width: ButtonConst.width - 10,
    margin: ButtonConst.margin + 5,
  },

  left: {
    alignSelf: 'flex-start',
    marginLeft: 0,
    borderTopRightRadius: ButtonConst.borderRadius,
    borderBottomRightRadius: ButtonConst.borderRadius,
  },

  right: {
    alignSelf: 'flex-end',
    marginRight: 0,
    borderTopLeftRadius: ButtonConst.borderRadius,
    borderBottomLeftRadius: ButtonConst.borderRadius,
  },

  text: {
    flex: 1,
    textAlignVertical: 'center',
    fontSize: ButtonConst.fontSize,
    color: Colors.bg,
    fontStyle: ButtonConst.fontStyle,
    fontWeight: ButtonConst.fontWeight,
  },

  leftText: {
    textAlign: 'right',
  },

  rightText: {
    textAlign: 'left',
  },

  textPressed: {
    fontSize: ButtonConst.fontSize - 4,
  },

  icon: {
    flex: 0,
    width:60,
    margin: ButtonConst.margin,
    alignSelf: 'center',
  },
});
export const ListTheme = StyleSheet.create({
  container: {
    flex: 10,
    width: dimensions.w,
    borderTopWidth: 1,
    backgroundColor: Colors.transparentSemi,
    
  },
  row: {
    flex:1,
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
  },
  image: {
    flex: 1,
  },
  content: {
    flex: 10,
    paddingLeft: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontStyle: 'italic'
  },
  loader: {
    height: d.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export const BaseTheme = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 10,
    width: dimensions.w,
    backgroundColor: Colors.transparent
  },
  header: {
    width: dimensions.w,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  reverseRow: {
    flexDirection: 'row-reverse',
  },
  row: {
    flexDirection: 'row',
  },
  headerTitle: {
    color: Colors.headingText,
    fontSize: 24,
    flex: 5,
    textAlign: 'left',
    marginLeft: 10,
  },
  italic: {
    fontStyle: 'italic',
  },
  shadow: {
    shadowColor: 'rgba(0,0,0, 0.5)', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 5, //IOS
  },
});
export const SearchTheme = StyleSheet.create({
  container: {
    height: 60,
    width: dimensions.w,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.transparent,
    borderTopWidth: 0,
    borderColor: Colors.secondary,
  },
  input: {
    flex: 1,
    width: '90%',
    backgroundColor: Colors.bg,
  },
});
export const SpeciesTheme = StyleSheet.create({
  info: {
    flex: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  scroll: {
    flex:1,
  },
  mainImageContainer: {
    flex: 10,
    padding: 5,
    flexDirection: "row",
    backgroundColor: Colors.transparent,
  },
  mainImage: {
    flex: 3,
    height: 200,
    width: 200,
    padding: 5,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  namesContainer: {
    flex: 4,
    padding: 10,
    flexDirection: 'column',
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  },
  detailContent: {
    flex: 12,
    textAlign: 'justify',
    textAlignVertical: 'center',
    color: Colors.secondary,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: Colors.transparentSemi,
  },
  detailLabel: {
    flex: 9,
    fontSize: 22,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    paddingBottom: 0,
    color: Colors.secondary,
  },
});
export const FilterTheme = StyleSheet.create ({
  group: {
    borderColor: Colors.transparent,
    borderWidth: 0,
    backgroundColor: Colors.transparent,
  },
  container: {
    width: '100%',
    maxHeight: 100,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
    backgroundColor: Colors.transparent,
  },
  labelContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    shadowColor: 'rgba(0,0,0, 0.5)', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 5, //IOS
    elevation: 5, // Android
    zIndex: 10,
  },
  button: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.transparent
  },
  border: {
    color: Colors.transparent
  },
  selectedButton: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.transparent
  },
  selectedText: {
    color: Colors.primary,
  },
  text: {
    color: Colors.secondary,
  },
  label: {
    color: Colors.headingtext,
    fontWeight: "bold",
    fontSize: 18
  },
  icon: {
    color: Colors.headingtext,
    fontWeight: "bold",
    fontSize: 18,
  },
});