import { configureStore } from "@reduxjs/toolkit";
import basketSlice from "./basketSlice";
import { dishReducer } from "./reducers/dishReducer";
import { feedbackReducer } from "./reducers/feedbackReducer";
import { orderReducer } from "./reducers/orderReducer";
import { authReducer } from "./reducers/userReducer";

const store = configureStore({
    reducer: {
        auth: authReducer,
        dishes: dishReducer,
        basket: basketSlice,
        orders: orderReducer,
        feedbacks: feedbackReducer,
    }
})

export default store