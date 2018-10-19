import { StyleSheet, Text, View } from "react-native";

export const Theme = StyleSheet.create({
    containerContainer: {
      height: "100%",
      width: "100%"
    },
    contentContainer: {
      flex: 10,
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: "skyblue"
    },
    headerContainer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "nowrap",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "brown"
    },
    listContainer: {
      flex: 10,
      width: '100%',
      backgroundColor: "red",
    },
    searchContainer: {
      flex: 1,
      width: '100%',
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: "green"
    },
    headerTitle: {
      flex: 5,
      textAlign: "left",
      marginLeft: 10,
    },
    headerButton: {
      flex: 1,
      marginTop: 10,
      padding: 10
    }
  });