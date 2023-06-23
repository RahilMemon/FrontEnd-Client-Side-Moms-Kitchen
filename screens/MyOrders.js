import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Dishes from "../components/Dishes";
import { useNavigation } from "@react-navigation/native";
import OrderDish from "../components/OrderDish";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../redux/actions/orderAction";
import AppBar from "../components/AppBar";
import Loading from "../components/Loading";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, user, chefs, loadingA } = useSelector(
    (state) => state.auth
  );
  const { orders, loadingO } = useSelector((state) => state.orders);
  // const [myOrders, setMyOrders] = useState(orders?.Orders)

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    dispatch(getUserOrders(user?._id));
    setRefreshing(false);
    // setMyOrders(orders)
  }, [dispatch, refreshing]);

  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-white">
      <AppBar title="My Orders" />

      <View className="px-2">
        {isAuthenticated ? loadingO ? <Loading /> : (
          <OrderDish
            orders={orders?.Orders}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="font-extrabold text-2xl">Please Login First</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyOrders;
