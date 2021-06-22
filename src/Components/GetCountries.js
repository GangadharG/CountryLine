import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import SearchBar from "react-native-dynamic-search-bar";
import Icon from "react-native-dynamic-vector-icons";

import { LOAD_COUNTRIES } from "../GraphQL/Queries";

function GetCountries() {
  const { data } = useQuery(LOAD_COUNTRIES);

  const [listOfCountries, setListOfCountries] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [sortOrderType, setSortOrderType] = useState("ASC");

  const sortCountries = (list, order) => {
    let newListOfCountries = [];
    newListOfCountries = [...list].sort((a, b) => {
      let caName = a.name.toLowerCase();
      let cbName = b.name.toLowerCase();
      if (caName < cbName) {
        return order === "ASC" ? -1 : 1;
      }
      if (caName > cbName) {
        return order === "ASC" ? 1 : -1;
      }
      return 0;
    });
    return newListOfCountries;
  };

  const handleChangeOrder = (orderType) => {
    if (orderType === sortOrderType) {
      return;
    }
    let sortedCountries = sortCountries(data.countries, orderType);
    setListOfCountries(sortedCountries);
    setSearchList(sortedCountries);
    setSortOrderType(orderType);
  };

  const handleOnChangeText = (text) => {
    if (text.length > 2) {
      let newSearchList = listOfCountries.filter((country) =>
        country.name.toLowerCase().includes(text)
      );
      setSearchList(newSearchList);
    } else {
      setSearchList(listOfCountries);
    }
  };

  const renderCountryItem = (item) => {
    return (
      <View style={styles.countryItem}>
        <View>
          <Text style={{ fontSize: 42 }}>{item.emoji}</Text>
        </View>
        <View style={styles.nameAndContinent}>
          <View style={styles.countryStateName}>
            <Text style={styles.countryName}>{item.name}</Text>
            {item.capital && (
              <Text style={styles.stateName}>{", " + item.capital}</Text>
            )}
          </View>
          <View style={styles.countryContinent}>
            <Text>{item.continent.name}</Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (data) {
      let sortedCountries = sortCountries(data.countries, sortOrderType);
      setListOfCountries(sortedCountries);
      setSearchList(sortedCountries);
    }
  }, [data]);

  return (
    <SafeAreaView style={styles.countriesContainer}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder="Search here"
          onPress={() => alert("onPress")}
          backgroundColor="#ccc"
          style={{ backgroundColor: "#ccc" }}
          iconColor="#fff"
          cancelIconColor="#fff"
          onChangeText={handleOnChangeText}
          onClearPress={() => {
            setSearchList(listOfCountries);
          }}
        />
      </View>
      <View style={styles.filtersContainer}>
        <View style={styles.filterNameView}>
          <Text style={styles.filterLabel}>Sort By:</Text>
          <Text style={styles.filterName}>Name</Text>
        </View>
        <View style={styles.filterOrderView}>
          <Text style={styles.filterLabel}>Order:</Text>
          <View style={styles.filterIconsView}>
            <Icon
              name="caretup"
              type="AntDesign"
              size={16}
              color={sortOrderType === "ASC" ? "black" : "grey"}
              style={{
                paddingTop: 3,
                paddingRight: 5,
              }}
              onPress={() => {
                handleChangeOrder("ASC");
              }}
            />
            <Icon
              name="caretdown"
              type="AntDesign"
              size={16}
              color={sortOrderType === "DES" ? "black" : "grey"}
              onPress={() => {
                handleChangeOrder("DES");
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </View>
        </View>
      </View>
      {searchList && searchList.length > 0 && (
        <View style={styles.listContainer}>
          <FlatList
            data={searchList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderCountryItem(item)}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  countriesContainer: {
    marginTop: Platform.OS === "android" ? 20 : 0,
    marginHorizontal: 16,
  },
  searchBarContainer: {
    marginTop: 10,
    backgroundColor: "#ccc",
    height: 54,
    justifyContent: "center",
    borderRadius: 6,
  },
  filterNameView: {
    flexDirection: "row",
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  filterLabel: {
    color: "#51aef5",
    fontWeight: "bold",
  },
  filterName: {
    paddingLeft: 10,
    fontWeight: "bold",
  },
  filterOrderView: {
    flexDirection: "row",
  },
  filterIconsView: {
    flexDirection: "row",
    paddingLeft: 10,
  },
  listContainer: {
    marginTop: 5,
  },
  countryItem: {
    flexDirection: "row",
    marginVertical: 5,
  },
  nameAndContinent: {
    paddingLeft: 10,
    justifyContent: "space-around",
  },
  countryStateName: {
    flexDirection: "row",
  },
  countryName: {
    fontWeight: "bold",
  },
  stateName: {
    paddingLeft: 3,
  },
  countryContinent: {},
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});

export default GetCountries;
