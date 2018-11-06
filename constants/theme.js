import { StyleSheet, Text, View } from "react-native";

const backgroundColor = "#fcf7f0";
const primaryColor = "#001964"
const transparentBackground = "rgba(52, 52, 52, 0.0)";

const headingTextColor = "white";

export const Theme = StyleSheet.create({
  containerContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: backgroundColor
  },
  contentContainer: {
    flex: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: backgroundColor
  },
  headerContainer: {
    flex: 1,
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
    flex: 1,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: backgroundColor
  },
  searchInput: {

  },
  headerTitle: {
    color: headingTextColor,
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