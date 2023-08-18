import { StyleSheet } from "react-native";

import { FONT, SIZES, COLORS } from "../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  userContainer: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
    marginBottom: 5,
  },
});

export default styles;
