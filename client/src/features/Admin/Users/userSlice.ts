import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../Auth/authSlice";

export interface UsersState {
  users: User[];
  selectedUser?: User | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
  },
});
export const { setUsers, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
