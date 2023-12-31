import {
  View,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import DishesList from "../components/Dishes";
import Chefs from "../components/Chefs";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { getSearchDishes } from "../redux/actions/dishAction";
import { SERVER_URL } from "@env";
import Loading from "../components/Loading";

const Search = ({ navigation, route }) => {
  const { searchDishes, loadingD } = useSelector((state) => state.dishes);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [sortType, setSortType] = useState("");
  const [dishType, setdishType] = useState("all");

  const [view, setView] = useState("List");
  const [viewIcon, setViewIcon] = useState("list");

  const handleView = () => {
    if (view == "List") {
      setView("Grid");
      setViewIcon("grid");
    }
    if (view == "Grid") {
      setView("List");
      setViewIcon("list");
    }
  };

  const handleQuery = async (text) => {
    if (text !== query) {
      setQuery(text);
    }
  };

  function debounce(func, timeout) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const debouncedSearch = useCallback(
    debounce((text) => {
      dispatch(getSearchDishes(text, sortType, dishType));
    }, 300),
    [dispatch, sortType, dishType]
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    if (route?.params) {
      if (route?.params.sort) {
        setSortType(Number(route?.params.sort));
      }
      if (route?.params.catList) {
        setdishType(route?.params.catList);
      }
    }
    debouncedSearch(query);
    setRefreshing(false)
  }, [route, dispatch, query, sortType, dishType, debouncedSearch, refreshing]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "gray" }}
      style={{ backgroundColor: "white" }}
      labelStyle={{ color: "#262525" }}
    />
  );

  const DishesRoute = () => {
    return (
      <>
        {loadingD ? (
          <Loading />
        ) : (
          <View className="">
            <DishesList
              view={view}
              dishes={searchDishes?.Dishes}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          </View>
        )}
      </>
    );
  };
  const ChefsRoute = () => {
    return (
      <View className="justify-center">
        {loadingD ? (
          <Loading />
        ) : (
          <Chefs chefs={searchDishes?.Chefs} view={view} refreshing={refreshing}
          onRefresh={onRefresh}/>
        )}
      </View>
    );
  };

  const renderScene = SceneMap({
    dishes: DishesRoute,
    chefs: ChefsRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "dishes", title: "Dishes" },
    { key: "chefs", title: "Chefs" },
  ]);

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-10 px-4 h-24 shadow shadow-black z-50">
        <View className="flex-row flex-1 items-center space-x-2">
          {isAuthenticated && user?.userType == "Chef" && (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              className="bg-[#e4eaf0] rounded-full w-10 h-10 shadow shadow-black"
            >
              <Image
                source={{ uri: SERVER_URL + user?.photo }}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
          )}
          <View className="bg-white px-3 flex-row flex-1 justify-start items-center border border-slate-200 rounded-md focus:border-slate-300 focus:shadow-lg focus:shadow-slate-600 shadow-md shadow-slate-500">
            <TouchableOpacity className="">
              <Ionicons name="search" color="#c0c0c0" size={25} />
            </TouchableOpacity>
            <TextInput
              className="bg-white flex-1 px-2 py-2 shadow-lg text-base"
              placeholder="Dishes and Chefs"
              enterKeyHint="search"
              placeholderTextColor="gray"
              inputMode="search"
              value={query}
              onChangeText={handleQuery}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Filter", { sortType, dishType })
            }
            className="items-center justify-center p-2 rounded-md bg-white shadow shadow-black border border-slate-200"
          >
            <Ionicons name="options-outline" color="#252626" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleView}
            className="items-center justify-center p-2 rounded-md bg-white shadow shadow-black border border-slate-200"
          >
            <Ionicons name={viewIcon} color="#252626" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default Search;
