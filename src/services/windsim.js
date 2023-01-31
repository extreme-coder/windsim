// Need to use the React-specific entry point to import createApi
import pluralize from 'pluralize';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const windsimApi = createApi({
  reducerPath: 'windsimApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://api.nation-builder.org/api/`,
    prepareHeaders: (headers, { getState }) => {
      return headers
    },
  }),
 
  endpoints: (builder) => ({
    getSpeed: builder.query({
      query: (arg) => {
        const { lat, lng, turbine } = arg;
        console.log(turbine)
        return `wind/?lat=${lat}&lon=${lng}&height=84&date_from=2019-01-01&date_to=2019-12-31&turbine=${turbine}&mean=month`
      },
      responseHandler: "text",
      transformResponse: (response: { data: Post }, meta, arg) => {
        console.log(response)
        return response
      },
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg
      ) => {
        console.log(response)
        return response.status
      },
    }),
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSpeedQuery,
} = windsimApi