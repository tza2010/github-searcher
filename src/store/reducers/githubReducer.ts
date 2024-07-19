import {
  createAsyncThunk,
  createSlice,
  GetThunkAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { userType } from "../../types/userType";
import { repositoryType } from "../../types/repositoryType";
import { AsyncThunkConfig } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { RootState } from ".";

interface usersMap {
  [key: string]: { totalCount: number; data: userType[] };
}
interface repositoriesMap {
  [key: string]: {
    totalCount: number;
    data: repositoryType[];
  };
}

interface githubState {
  isLoading: boolean;
  usersMap: usersMap;
  repositoriesMap: repositoriesMap;
  result: userType[] | repositoryType[];
  hasMore: boolean;
  error: string | undefined;
}

const initialState: githubState = {
  isLoading: false,
  usersMap: {},
  repositoriesMap: {},
  result: [],
  hasMore: false,
  error: "",
};

export const fetchData = createAsyncThunk(
  "github/fetchData",
  async (
    { term, type }: { term: string; type: string },
    thunkAPI: GetThunkAPI<AsyncThunkConfig>
  ) => {
    const state = thunkAPI.getState() as RootState;
    if (type === "users") {
      if (term in state.github.usersMap) {
        const firstBatch = state.github.usersMap[term].data.slice(0, 30);
        return {
          data: firstBatch,
          totalCount:
            state.github.usersMap[term].totalCount > 1000
              ? 1000
              : state.github.usersMap[term].totalCount,
          hasMore: firstBatch.length < state.github.usersMap[term].totalCount,
          term,
          type,
          newData: false,
        };
      }
    } else {
      if (term in state.github.repositoriesMap) {
        const firstBatch = state.github.repositoriesMap[term].data.slice(0, 30);
        return {
          data: state.github.repositoriesMap[term].data.slice(0, 30),
          totalCount:
            state.github.repositoriesMap[term].totalCount > 1000
              ? 1000
              : state.github.repositoriesMap[term].totalCount,
          hasMore:
            firstBatch.length < state.github.repositoriesMap[term].totalCount,
          term,
          type,
          newData: false,
        };
      }
    }
    const response = await axios.get(
      `https://api.github.com/search/${type}?q=${term}`
    );
    const maxTotalCount =
      response.data["total_count"] > 1000 ? 1000 : response.data["total_count"];
    return {
      data: response.data.items.slice(0, 30),
      totalCount: maxTotalCount,
      hasMore: response.data.items.length < maxTotalCount,
      term,
      type,
      newData: true,
    };
  }
);

export const fetchMore = createAsyncThunk(
  "github/fetchMore",
  async (
    { term, type }: { term: string; type: string },
    thunkAPI: GetThunkAPI<AsyncThunkConfig>
  ) => {
    const state = thunkAPI.getState() as RootState;
    const resultLength = state.github.result.length;
    if (type === "users") {
      const usersDataLength = state.github.usersMap[term].data.length;
      if (resultLength < usersDataLength) {
        const newBatch = state.github.usersMap[term].data.slice(
          resultLength,
          resultLength + 30
        );
        return {
          data: newBatch,
          hasMore:
            newBatch.length + resultLength <
            state.github.usersMap[term].totalCount,
          fetched: false,
          term,
          type,
        };
      } else {
        const response = await axios.get(
          `https://api.github.com/search/${type}?q=${term}&page=${
            Math.ceil(resultLength / 30) + 1
          }`
        );
        const newBatch = response.data.items;
        return {
          data: newBatch,
          hasMore:
            newBatch.length + resultLength <
            state.github.usersMap[term].totalCount,
          fetched: true,
          term,
          type,
        };
      }
    } else {
      const repositoriesDataLength =
        state.github.repositoriesMap[term].data.length;
      if (resultLength < repositoriesDataLength) {
        const newBatch = state.github.repositoriesMap[term].data.slice(
          resultLength,
          resultLength + 30
        );
        return {
          data: newBatch,
          hasMore:
            newBatch.length + resultLength <
            state.github.repositoriesMap[term].totalCount,
          fetched: false,
          term,
          type,
        };
      } else {
        const response = await axios.get(
          `https://api.github.com/search/${type}?q=${term}&page=${
            resultLength / 30 + 1
          }`
        );
        const newBatch = response.data.items;
        return {
          data: newBatch,
          hasMore:
            newBatch.length + resultLength <
            state.github.repositoriesMap[term].totalCount,
          fetched: true,
          term,
          type,
        };
      }
    }
  }
);

const githubSlice = createSlice({
  name: "github",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.result = [];
      state.hasMore = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(
        fetchData.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: userType[] | repositoryType[];
            totalCount: number;
            hasMore: boolean;
            term: string;
            type: string;
            newData: boolean;
          }>
        ) => {
          state.isLoading = false;
          if (action.payload.newData) {
            if (action.payload.type === "users") {
              state.usersMap = {
                ...state.usersMap,
                [action.payload.term]: {
                  data: action.payload.data as userType[],
                  totalCount: action.payload.totalCount,
                },
              };
            } else {
              state.repositoriesMap = {
                ...state.repositoriesMap,
                [action.payload.term]: {
                  data: action.payload.data as repositoryType[],
                  totalCount: action.payload.totalCount,
                },
              };
            }
          }
          state.result = action.payload.data;
          state.hasMore = action.payload.hasMore;
        }
      )
      .addCase(fetchData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMore.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(
        fetchMore.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: userType[] | repositoryType[];
            hasMore: boolean;
            fetched: boolean;
            term: string;
            type: string;
          }>
        ) => {
          if (action.payload.fetched) {
            if (action.payload.type === "users") {
              state.usersMap = {
                ...state.usersMap,
                [action.payload.term]: {
                  data: [
                    ...state.usersMap[action.payload.term].data,
                    ...(action.payload.data as userType[]),
                  ],
                  totalCount: state.usersMap[action.payload.term].totalCount,
                },
              };
            } else {
              state.repositoriesMap = {
                ...state.repositoriesMap,
                [action.payload.term]: {
                  data: [
                    ...state.repositoriesMap[action.payload.term].data,
                    ...(action.payload.data as repositoryType[]),
                  ],
                  totalCount:
                    state.repositoriesMap[action.payload.term].totalCount,
                },
              };
            }
          }
          state.result = [...state.result, ...action.payload.data] as
            | userType[]
            | repositoryType[];
          state.isLoading = false;
          state.hasMore = action.payload.hasMore;
        }
      )
      .addCase(fetchMore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.hasMore = false;
      });
  },
});

export const { clearResults } = githubSlice.actions;
export default githubSlice.reducer;
