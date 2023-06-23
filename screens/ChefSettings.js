import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import ChefAppBar from "../components/ChefAppBar";

const ChefSettings= () => {
  return (
    <View className="flex-1 bg-white">
      <ChefAppBar title="Settings" />
    </View>
  );
};

export default ChefSettings;
