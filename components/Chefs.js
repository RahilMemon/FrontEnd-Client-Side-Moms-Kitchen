import { View, Text, FlatList, RefreshControl } from "react-native";
import React from "react";
import ChefCard from "./ChefCard";
// import { chefs } from '../MockData/MockData'

const Chefs = ({ view, chefs, refreshing, onRefresh }) => {
  return (
    <>
      {view == 'homeGrid' && <FlatList
        horizontal
        contentContainerStyle={{
          paddingTop: 10,
          paddingRight: 30,
        }}
        data={chefs}
        renderItem={({ item }) => <ChefCard chef={item} view={view} />}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
      />}
      {view == 'Grid' && <FlatList
        vertical
        contentContainerStyle={{
          paddingTop: 10,
          paddingLeft: 1,
        }}
        data={chefs}
        renderItem={({ item }) => <ChefCard chef={item} view={view} />}
        numColumns={3}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />}
      {view == 'List' && <FlatList
        vertical
        contentContainerStyle={{
          paddingTop: 10,
          // paddingRight: 30,
        }}
        data={chefs}
        renderItem={({ item }) => <ChefCard chef={item} view={view} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />}
    </>
  );
};

export default Chefs;
