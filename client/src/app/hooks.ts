// Import hooks, types from react-redux and app store.
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Custom useDispatch hook with AppDispatch type for type safety
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom useSelector hook with RootState type for type safety
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
