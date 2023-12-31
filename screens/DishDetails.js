import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Button,
  TouchableNativeFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import ReadMore from "@fawazahmed/react-native-read-more";
import Dishes from "../components/Dishes";
import * as Animatable from "react-native-animatable";
import { SERVER_URL } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { getDishes } from "../redux/actions/dishAction";
import Loading from "../components/Loading";
import { addItem } from "../redux/basketSlice";
import FeedbackSection from "../components/FeedbackSection";
import IndividualRatingProgressBar from "../components/IndividualRatingProgressBar";
// import Carousel from 'react-native-snap-carousel';

const DishDetails = () => {
  const [loading, setLoading] = useState(false);
  const {
    params: {
      _id,
      chef,
      name,
      desc,
      cuisine,
      availableQty,
      type,
      price,
      photos,
      feedbacks,
      avgRating,
      reviewsCount,
      feedbackCount,
    },
  } = useRoute();

  const { dishes } = useSelector((state) => state.dishes);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items, total } = useSelector((state) => state.basket);
  const dispatch = useDispatch();
  const [userFeedback, setUserFeedback] = useState(
    feedbacks.filter((feedback) => feedback.customer._id === user?._id)[0]
  );
  const [recommendDishes, setrecommendDishes] = useState(dishes?.Dishes);

  const filledStars = Math.floor(avgRating);
  const hasHalfStar = avgRating - filledStars >= 0.5;
  const halfStar = hasHalfStar ? 1 : 0;
  const emptyStars = 5 - filledStars - halfStar;

  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    setLoading(true);
    setrecommendDishes((recommendDishes) =>
      recommendDishes.filter((item) => item.type === type && item._id !== _id)
    );

    setLoading(false);

    const ratingData = feedbacks.reduce((acc, feedback) => {
      const rating = feedback.rating;
      if (!acc[rating]) {
        acc[rating] = 0;
      }
      acc[rating]++;
      return acc;
    }, {});

    const updatedRatings = Array.from({ length: 5 }, (_, index) => {
      const stars = index + 1;
      return {
        stars,
        count: ratingData[stars] || 0,
      };
    }).reverse();

    setRatings(updatedRatings);
  }, []);

  const navigation = useNavigation();

  const addToCart = async () => {
    let item = {
      _id: _id,
      name: name,
      chefName: chef.name,
      chefId: chef._id,
      price: price,
      photo: photos[0],
      quantity: 1,
      itemTotal: 0,
      userId: user?._id,
    };
    await dispatch(addItem(item));
  };

  return (
    <>
      <View className="absolute bottom-10 z-50 w-full">
        {isAuthenticated && user?.userType == "Chef" ? (
          <View />
        ) : items.findIndex((item) => item._id === _id) !== -1 ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("Basket")}
            className="flex-row justify-center space-x-2 items-center p-3 mx-6 rounded-2xl bg-[#5E72EB] shadow shadow-black"
          >
            <Ionicons name="cart" color="white" size={25} />
            <Text className="text-center font-semibold text-white text-lg">
              Go to Cart
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={addToCart}
            className="flex-row justify-center space-x-2 items-center p-3 mx-6 rounded-2xl bg-[#5E72EB] shadow shadow-black"
          >
            <Ionicons name="cart" color="white" size={25} />
            <Text className="text-center font-semibold text-white text-lg">
              Add to Basket
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="relative bg-slate-50 flex-1"
      >
        <View className="mt-8 relative py-2 rounded-3xl justify-between items-center">
          <View className="w-96 h-96 object-contain mx-auto rounded-3xl shadow-md shadow-black">
            <Image
              source={{ uri: SERVER_URL + photos[0] }}
              className="w-96 h-96 object-contain mx-auto rounded-3xl"
            />
          </View>
          <View className="absolute top-8 flex-row flex-1 items-center justify-between w-full px-7">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className=" bg-[#e4eaf0] rounded-full w-8 h-8 justify-center items-center"
            >
              <Ionicons name="chevron-back-outline" color="#262525" size={25} />
            </TouchableOpacity>
            <Text className=" text-white font-semibold text-base">Details</Text>
            <TouchableOpacity className="bg-[#e4eaf0] rounded-full w-8 h-8 justify-center items-center">
              <Ionicons name="heart-outline" color="#262525" size={25} />
            </TouchableOpacity>
          </View>
        </View>
        <Animatable.View
          animation="slideInUp"
          iterationCount={1}
          className="mt-1 pt-3 pb-32 px-6 space-y-4 bg-white rounded-3xl shadow-2xl shadow-black"
        >
          <View className="flex-row justify-between items-center">
            <View className="w-3/4">
              <Text className="text-2xl font-bold text-[#262525]">{name}</Text>
              <Text className="text-sm text-gray-500">{type}</Text>
              <View className="flex-row space-x-2 justify-start items-center mt-2">
                <Ionicons name="star" color="#FFDD43" size={20} />
                <Text className="text-lg font-bold text-[#262525]">
                  {avgRating}
                </Text>
                <Text className="text-sm font-bold text-gray-500">
                  {`(${reviewsCount} Reviews)`}
                </Text>
              </View>
            </View>
            <Text className="text-3xl text-center font-bold text-[#262525] rounded-md">
              ₹{price}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChefProfile", {
                _id: chef._id,
                name: chef.name,
                address: chef.address,
                email: chef.email,
                phone: chef.phone,
                photo: chef.photo,
                chefSpecialization: chef.chefSpecialization,
                userType: chef.userType,
              })
            }
            className="flex-row items-center space-x-4"
          >
            <Image
              source={{ uri: SERVER_URL + chef.photo }}
              className="h-10 w-10 rounded-full b"
            />
            <Text className="font-medium text-lg">{chef.name}</Text>
          </TouchableOpacity>
          <ReadMore
            numberOfLines={3}
            seeLessStyle={{ color: "#5E72EB" }}
            seeMoreStyle={{ color: "#5E72EB" }}
          >
            {desc}
          </ReadMore>
          <Text className="font-semibold text-base py-2">
            Available Quantity:{" "}
            <Text className="font-normal">{availableQty}</Text>
          </Text>

          <View className="border-b border-gray-300" />
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="flex-1 text-lg font-semibold">
                Ratings & Feedbacks
              </Text>
              {isAuthenticated && user.userType==="Chef" ? <View /> : <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AddFeedback", {
                    dishId: _id,
                    dish: name,
                    photo: photos[0],
                    chef: chef.name,
                    userFeedback,
                  })
                }
                className="bg-white border p-2 rounded-md border-[#5E72EB] shadow shadow-[#5E72EB]"
              >
                <Text className="text-[#5E72EB]">Rate Dish</Text>
              </TouchableOpacity>}
            </View>

            {feedbacks.length <= 0 ? (
              <Text className="text-base text-gray-500">No Feedbacks</Text>
            ) : (
              <FeedbackSection feedbacksData={{feedbacks, ratings, avgRating, reviewsCount, feedbackCount}} stars={{filledStars, emptyStars, hasHalfStar}} />
            )}
            <TouchableOpacity
              disabled={feedbacks.length <= 0}
              onPress={() =>
                navigation.navigate("Feedbacks", {
                  feedbacksData: {feedbacks, ratings, avgRating, reviewsCount, feedbackCount},
                  stars: {filledStars, emptyStars, hasHalfStar}
                })
              }
              className="active:bg-slate-100 rounded-xl p-2 w-16 justify-start"
            >
              <Text className="text-[#5E72EB] font-semibold">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="border-b border-gray-300" />

          {recommendDishes.length > 0 && (
            <View className="-ml-4">
              <View className="flex-row justify-between pl-4 -pr-4">
                <Text className="text-base">More {type} dishes</Text>
                <TouchableOpacity>
                  <Text className="text-base text-[#5E72EB]">See more</Text>
                </TouchableOpacity>
              </View>
              {loading ? (
                <Loading />
              ) : (
                <Dishes view="recommendGrid" dishes={recommendDishes} />
              )}
            </View>
          )}
        </Animatable.View>
      </ScrollView>
    </>
  );
};

export default DishDetails;
