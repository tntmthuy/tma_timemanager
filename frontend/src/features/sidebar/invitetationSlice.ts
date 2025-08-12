import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";
import axios from "axios";

export const acceptInvitationThunk = createAsyncThunk<
  string, // ✅ message trả về
  string  // ✅ teamId truyền vào
>("invitation/accept", async (teamId: string, { rejectWithValue }) => {
  try {
    const res = await api.post(`/api/invitations/${teamId}/accept`);
    return res.data.message;
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      err.response?.data?.code === 2015
    ) {
      return rejectWithValue(
        "You’ve reached your team limit. Please upgrade your account to join more teams."
      );
    }

    const fallback =
      axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Cannot accept invitation";

    return rejectWithValue(fallback);
  }
});

export const declineInvitationThunk = createAsyncThunk<
  string,
  string
>("invitation/decline", async (teamId: string, { rejectWithValue }) => {
  try {
    const res = await api.post(`/api/invitations/${teamId}/decline`);
    return res.data.message;
  } catch {
    return rejectWithValue("FAILED_DECLINE_INVITE");
  }
});