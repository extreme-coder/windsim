// Need to use the React-specific entry point to import createApi
import pluralize from 'pluralize';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const windsimApi = createApi({
  reducerPath: 'windsimApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_DOMAIN}/api/`,
    prepareHeaders: (headers, { getState }) => {
      return headers
    },
  }),
 
  endpoints: (builder) => ({
    getSpeed: builder.query({
      query: (arg) => {
        const { lat, lng, turbine, height } = arg;
        console.log(turbine)
        return `wind/?lat=${lat}&lon=${lng}&height=${height}&date_from=2019-01-01&date_to=2019-12-31&turbine=${turbine}&mean=month`
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
    getAreaRequests: builder.query({
      query: (arg) => {
        const { session_id } = arg;
        return `area-requests?filters[session_id][$eq]=${session_id}`
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
    addAreaRequest: builder.mutation({
      query(arg) {
        const { body } = arg;
        return {
          url: `area-requests`,
          method: 'POST',
          body,
        }
      },
    }),
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSpeedQuery,
  useGetAreaRequestsQuery,
  useAddAreaRequestMutation,
} = windsimApi