import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SERVER_URL } from "@env";
import { useSelector } from "react-redux";

const ChefAppBar = ({ title }) => {

  const { user } = useSelector((state) => state.auth);
  
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View className="bg-white h-24 pt-8 flex-row justify-between items-center px-6 shadow-md shadow-black z-50 space-x-4">
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          className="bg-[#e4eaf0] rounded-full w-8 h-8 justify-center items-center"
        >
          <Image
            source={{ uri: SERVER_URL + user?.photo }}
            className="w-8 h-8 rounded-full"
          />
        </TouchableOpacity>
      <Text className="text-black font-semibold text-lg flex-1">{title}</Text>
    </View>
  );
};

export default ChefAppBar;
