import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import BasketDish from "../components/BasketDish";
import { useDispatch, useSelector } from "react-redux";
import { getBasket, removeBasket } from "../utils/basket";
import { addItem, clearCart, decrementQuantity, removeItem } from "../redux/basketSlice";
import { placeOrder } from "../redux/actions/orderAction";
import Toast from "react-native-toast-message";
import AppBar from "../components/AppBar";

const Checkout = ({ navigation }) => {

  const [basket, setBasket] = useState({ items: [], total: 0 });
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const { success, message, error, loadingO } = useSelector(
    (state) => state.orders
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBasket = async () => {
      if (isAuthenticated) {
        const basketData = await getBasket(user._id);
        setBasket(basketData);
      }
    };

    fetchBasket();

    
    if(success){
      const clearBasket = async (userId) => {
        await dispatch(clearCart(userId))
        await removeBasket(userId)
      }
      clearBasket(user._id)
      Toast.show({
        type: "success",
        text1: message,
      });
      dispatch({ type: "clearSuccess" });
      dispatch({ type: "clearMessage" });
      navigation.replace("UserTabNavigation", { screen: "Orders" });
    }
    if(error) {
      console.log(error)
      Toast.show({
        type: "error",
        text1: error,
      });
      dispatch({ type: "clearError" });
    }
    
  }, [isAuthenticated, user, message, error, success]);

  const updateBasketState = async () => {
    const updatedBasket = await getBasket(user._id);
    setBasket(updatedBasket);
  };

  const onDecrementQuantity = async (_id, userId) => {
    await dispatch(decrementQuantity({ _id, userId }));
    updateBasketState();
  };

  const onAddItem = async (_id, name, chefName, chefId, price, photo, userId)=> {
    let item = {
      _id: _id,
      name: name,
      chefName: chefName,
      chefId: chefId,
      price: price,
      photo: photo,
      quantity: 1,
      itemTotal: 0,
      userId: userId
    };
    await dispatch(addItem(item));
    updateBasketState();
  }

  const onRemoveItem = async (_id, userId) => {
    await dispatch(removeItem({ _id, userId }));
    updateBasketState();
  }

  const [name, setName] = useState(user?.name ? user?.name : "");
  const [phone, setPhone] = useState(user?.phone ? user?.phone : "");
  const [houseNo, sethouseNo] = useState(
    user?.address.houseNo ? user?.address.houseNo : ""
  );
  const [street, setStreet] = useState(
    user?.address.street ? user?.address.street : ""
  );
  const [city, setCity] = useState(
    user?.address.city ? user?.address.city : ""
  );
  const [pincode, setPincode] = useState(
    user?.address.pincode ? user?.address.pincode : ""
  );

  const generateOrderId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${month}${day}-${randomNum}`;
  };

  const handlePlaceOrder = () => {
    const orderId = generateOrderId();
    let deliveryAddress = {
      "houseNo": houseNo,
      "street": street,
      "city": city,
      "pincode": pincode
    }
    dispatch(placeOrder(orderId, basket, deliveryAddress, name, phone, basket.total))

  }

  return (
    <View className="flex-1 bg-slate-50">
      <AppBar title="Checkout" basketShown={false}/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
      >
        <View className="px-4">
          <Text className="text-lg font-semibold">Deliver to</Text>
          <View className="justify-center my-2 space-y-3 mx-1">
            <TextInput
              className="w-full bg-white py-3 px-4 border border-slate-100 rounded-md shadow shadow-black text-base focus:border-[#5E72EB]"
              keyboardType="email-address"
              placeholder="Email address"
              value={user?.email}
            />
            <View className="flex-row items-center space-x-2 justify-between">
              <TextInput
                className="w-[182px] bg-white py-3 px-4 border border-slate-100 rounded-md shadow shadow-black text-base focus:border-[#5E72EB]"
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                className="w-[182px] bg-white py-3 px-4 border border-slate-100 rounded-md shadow shadow-black text-base focus:border-[#5E72EB]"
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                value={phone.toString()}
                onChangeText={setPhone}
              />
            </View>
            <TextInput
              className="w-full bg-white py-3 px-4 border border-slate-100 rounded-md shadow shadow-black text-base focus:border-[#5E72EB]"
              placeholder="House No / Flat No / Floor"
              value={houseNo}
              onChangeText={sethouseNo}
            />
            <TextInput
              className="w-full bg-white py-3 px-4 border border-slate-100 rounded-md shadow shadow-black text-base focus:border-[#5E72EB]"
              placeholder="Society / Street Name"
              value={street}
              onChangeText={setStreet}
            />
            <View className="flex-row items-center space-x-2 justify-between">
              <TextInput
                className="w-[182px] bg-white py-3 px-4 border border-slate-100 rounded-md shadow shadow-black text-base focus:border-[#5E72EB]"
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                className="w-[182px] bg-white py-3 px-4 border border-slate-100 rounded-md shadow shadow-black text-base focus:border-[#5E72EB]"
                placeholder="Pincode"
                keyboardType="number-pad"
                value={pincode.toString()}
                onChangeText={setPincode}
              />
            </View>
          </View>
        </View>
        <View className="space-y-2">
          <BasketDish
            basketItems={basket}
            onAddItem={onAddItem}
            onDecrementQuantity={onDecrementQuantity}
            onRemoveItem={onRemoveItem}
          />
          <View className="bg-white mx-4 p-4 justify-center space-y-4 shadow shadow-black rounded-xl mb-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg">Subtotal</Text>
              <Text className="text-lg font-semibold">₹{basket.total}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-lg">Delivery Charge</Text>
              <Text className="text-lg font-semibold text-green-600">Free</Text>
            </View>
            <View className="border-b border-gray-300" />
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold">₹{basket.total}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handlePlaceOrder}

            disabled={basket.items.length < 1}
            className={`flex-row justify-center space-x-2 items-center p-3 mx-4 mb-2 rounded-full bg-[#5E72EB] shadow shadow-black ${basket.items.length < 1 && 'opacity-30'}`}
          >
            {loadingO ? <ActivityIndicator size="small" color="white" /> : <Text className="text-center font-semibold text-white text-lg">
              Proceed To Pay
            </Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Checkout;
