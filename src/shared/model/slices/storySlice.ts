import {Story} from "../../api/types.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface StoryState {
    story: Story;
    currentPage: number;
}

const initialState: StoryState = {
    story: {} as Story,
    currentPage: 1,
}

const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        setStory: (state, action: PayloadAction<Story>) => {
            state.story = action.payload
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        }
    }
})

export const {
    setStory,
    setCurrentPage,
} = storySlice.actions
export const storyReducer = storySlice.reducer
