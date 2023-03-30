// Need to use the React-specific entry point to import createApi
import pluralize from 'pluralize';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { io } from 'socket.io-client';

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
      providesTags: (result, error, arg) => [{ type: 'area-requests', id: 'LIST' }],
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
      invalidatesTags: (result, error, arg) => {
        let tags = [{ type: 'area-requests', id: 'LIST' }]        
        return tags
      },
    }),
    getMessages: builder.query({
      query: (sessionId) => `turbines`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        if(!arg) return;
        // create a websocket connection when the cache subscription starts
        //const ws = new WebSocket('ws://localhost:1337')
        const socket = io(process.env.REACT_APP_API_DOMAIN);
        try {
          socket.on('connect', () => {
            console.log("connected to socket")            
            //join the sessionId room
            socket.emit("join", { sessionId:arg }, (error) => {             
              console.log("joined the room:" + arg)
              if (error) return alert(error);
            });
          });

          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded           
          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          socket.on('progress', (message) => {                        
            dispatch({
              type: `windsimApi/invalidateTags`,
              payload: [{ type: 'area-requests', id: 'LIST' }],
            });              
          });

     

        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        socket.off('connect');
        socket.off('message');
      },
    })
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSpeedQuery,
  useGetAreaRequestsQuery,
  useAddAreaRequestMutation,
  useGetMessagesQuery
} = windsimApi