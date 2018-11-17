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
    top: '5%',
    width: dimensions.w,
    height: 200,
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
  buttonContainer: {
    height: 80,
    margin: 10,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    margin: 10,
    padding: ButtonConst.padding,
    borderRadius: ButtonConst.borderRadius,
  },
  saveButton: {
    backgroundColor: 'green',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  normalText: {
    color: Colors.contentText,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: ButtonConst.fontSize,
    fontWeight: ButtonConst.fontWeight,
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
  reverseColumn: {
    flexDirection: 'column-reverse',
  },
  headerTitle: {
    color: Colors.headingText,
    fontSize: 24,
    flex: 5,
    textAlign: 'left',
    marginLeft: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  centerText: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  shadow: {
    shadowColor: 'rgba(0,0,0, 0.5)', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 5, //IOS
    elevation: 5,
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
  mainInfoContainer: {
    flex: 10,
    padding: 5,
    paddingLeft: 10,
    flexDirection: "row",
    backgroundColor: Colors.transparent,
  },
  mainImageContainer: {
    flex: 3,
    overflow: 'hidden',
    borderRadius: 10,
  },
  mainImage: {
    flex: 3,
    height: 200,
    width: 200,
    padding: 5,
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
    overflow: 'hidden',
    padding: 10,
  },
  detailContent: {
    flex: 12,
    textAlign: 'justify',
    textAlignVertical: 'center',
    color: Colors.secondary,
    paddingLeft: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.transparentSemi,
  },
  detailTextContainer: {
    flex: 1,
    backgroundColor: Colors.transparent,
  },
  detailContentText: {
    color: Colors.secondary,
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
    color: Colors.headingText,
    fontWeight: "bold",
    fontSize: 18
  },
  icon: {
    color: Colors.headingText,
    fontWeight: "bold",
    fontSize: 18,
  },
});
export const EditModalTheme = StyleSheet.create ({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingBottom: 50,
    backgroundColor: Colors.transparent,
  },
  headerContainer: {
    flex: 1,
  },
  headerText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: Colors.headingText,
  },
  header: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  content: {
    flex: 10,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  fieldInputContainer: {
    flex: 2,
    minHeight: 80,
    justifyContent: 'center',
    backgroundColor: Colors.bg,
    borderRadius: ButtonConst.borderRadius,
  },
  fieldInput: {
    flex: 1,
    padding: 10,
  },
});
export const FieldInputTheme = StyleSheet.create ({
  container: {
    flex: 10,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    marginTop: 0,
    padding: 5,
    borderRadius: 10,
  },
  label: {
    flex:1,
  },
  labelText: {
    flex: 1,
    color: Colors.headingText,
  },
  inputContainer: {
    flex: 2,
    minHeight: 40,
    padding: 3,
    justifyContent: 'center',
    backgroundColor: Colors.bg,
    borderRadius: ButtonConst.borderRadius,
  },
  input: {
    flex: 1,
    paddingTop: 0,
  },
});
export const NewSpeciesTheme = StyleSheet.create ({
  header: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  headerText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: Colors.headingText,
  },
});