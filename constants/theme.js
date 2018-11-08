import { StyleSheet, Text, View } from "react-native";

export const backgroundColor = "#fcf7f0";
export const primaryColor = "#001964";
export const transparentBackground = "rgba(52, 52, 52, 0.0)";

export const headingTextColor = "white";

export const Theme = StyleSheet.create({
  containerContainer: {
    flex:1,
    backgroundColor: backgroundColor
  },
  contentContainer: {
    flex: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: backgroundColor
  },
  headerContainer: {
    height: 80,
    width: '100%',
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primaryColor
  },
  listContainer: {
    flex: 10,
    width: '100%',
    backgroundColor: backgroundColor,
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
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    height: 60,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primaryColor,
    borderTopWidth: 0,
    borderColor: primaryColor,
  },
  searchInput: {
    flex: 1,
    width: '90%',
    backgroundColor: backgroundColor,
  },
  headerTitle: {
    color: headingTextColor,
    flex: 5,
    textAlign: "left",
    marginLeft: 10,
  },
  headerButton: {
    flex: 1,
    padding: 10
  },
});