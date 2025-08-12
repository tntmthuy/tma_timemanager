
//src\state\store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../features/auth/authSlice";
import teamReducer from "../features/team/teamSlice";
import kanbanReducer from "../features/team/kanbanSlice";
import commentReducer from "../features/team/commentSlice";
import notificationReducer from "../features/sidebar/notificationSlice";
import subscriptionReducer from "../features/subscription/subscriptionSlice";
import focusReducer from "../features/focus/focusSlice";
import dashboardReducer from "../features/admin/dashboardSlice";
import adminReducer from '../features/admin/adminSlice';
import adminSubscriptionReducer from "../features/admin/adminSubscriptionSlice";

// 🔧 Gộp reducers
const rootReducer = combineReducers({
  auth: authReducer,
  team: teamReducer,
  kanban: kanbanReducer,
  comments: commentReducer,
  notification: notificationReducer,
  subscription: subscriptionReducer,
  focus: focusReducer,
  dashboard: dashboardReducer,
  admin: adminReducer,
  adminSubscription: adminSubscriptionReducer,
});

// 🔒 Cấu hình persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // ✅ chỉ lưu auth, tránh lưu team/kanban
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🏗️ Tạo store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 🔐 Tạo persistor để dùng với <PersistGate />
export const persistor = persistStore(store);

// 🔷 Type cho toàn bộ app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;