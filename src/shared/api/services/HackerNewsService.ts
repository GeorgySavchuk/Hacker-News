import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {Story, Comment} from "../types.ts";


export const HackerNewsApi = createApi({
    reducerPath: 'newApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://hacker-news.firebaseio.com/v0/'
    }),
    endpoints: (builder) => ({
        getLatestStoriesID: builder.query<number[], void>({
            query: () => ({
                url: 'newstories.json?print=pretty',
                method: 'GET'
            })
        }),
        getItemById: builder.query<Story | Comment, number>({
            query: (id: number) => ({
                url: `item/${id}.json?print=pretty`,
                method: 'GET'
            })
        })
    })
})

export const {
    useGetLatestStoriesIDQuery,
    useLazyGetItemByIdQuery
} = HackerNewsApi