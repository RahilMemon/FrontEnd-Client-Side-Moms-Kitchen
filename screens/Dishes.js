import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import DishesList from "../components/Dishes";
import Loading from "../components/Loading";
import AppBar from "../components/AppBar";

const Dishes = ({ navigation, route }) => {
  const { dishes } = useSelector((state) => state.dishes);

  const [loading, setLoading] = useState(false);
  const [categoryDishes, setCategoryDishes] = useState(dishes?.Dishes ? dishes?.Dishes : []);

  useEffect(() => {
    setLoading(true);
    if (route.params) {
      const { name } = route?.params;
      setCategoryDishes((categoryDishes) =>
        categoryDishes.filter((item) => item.type === name)
      );
    }
    setLoading(false);
  }, []);

  return (
    <View className="flex-1 bg-slate-50">
      <AppBar title={`${route?.params ? route?.params.name : 'All'} Dishes`} />
      <View className="">
        {loading && !dishes?.Dishes ? (
          <Loading />
        ) : (
          <DishesList view="List" dishes={categoryDishes} />
        )}
      </View>
    </View>
  );
};

export default Dishes;
