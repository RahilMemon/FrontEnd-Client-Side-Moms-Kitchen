import { View, Text, FlatList, StyleSheet, Image, RefreshControl } from "react-native";
import React from "react";
import DishCard from "./DishCard";
import { useRoute } from "@react-navigation/native";

const DishesList = ({ view, dishes, refreshing, onRefresh }) => {
  const route = useRoute();

  const getHeader = () => {
    return <View></View>;
  };

  const emptyFlatList = () => {
    return (
      <View classname="flex-1 justify-center items-center">
        <Image
          source={require("../assets/empty-dish.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>
    );
  };

  return (
    <>
      {view == "homeGrid" && (
        <FlatList
          horizontal
          contentContainerStyle={{
            paddingTop: 10,
            paddingRight: 30,
          }}
          data={dishes}
          renderItem={({ item }) => <DishCard dish={item} view={view} />}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
        />
      )}

      {view == "Grid" && (
        <FlatList
          vertical
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            paddingHorizontal: 6,
            paddingBottom: 200,
            paddingTop: 25,
          }}
          data={dishes}
          renderItem={({ item }) => <DishCard dish={item} view={view} />}
          keyExtractor={(item) => item._id}
          numColumns={2}
          ListEmptyComponent={emptyFlatList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {view == "List" && (
        <FlatList
          vertical
          contentContainerStyle={
            route.name === "ChefProfile" ? styles.listStyle : styles.listStyle2
          }
          data={dishes}
          renderItem={({ item }) => <DishCard dish={item} view={view} />}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={getHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {view == "recommendGrid" && (
        <FlatList
          horizontal
          contentContainerStyle={{
            paddingTop: 5,
            paddingRight: 30,
          }}
          data={dishes}
          renderItem={({ item }) => <DishCard dish={item} view={view} />}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listStyle: {
    paddingTop: 25,
    paddingBottom: 250,
  },
  listStyle2: {
    paddingTop: 25,
    paddingBottom: 150,
  },
});

export default DishesList;
