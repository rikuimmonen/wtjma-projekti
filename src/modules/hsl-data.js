const apiUrl = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

/**
 * https://digitransit.fi/en/developers/apis/1-routing-api/stops/#query-scheduled-departure-and-arrival-times-of-a-stop
 * @param {number} id - id number of the hsl stop (e.g.  "HSL:2132207" => "Karanristi")
 */
const getQueryForNextRidesByStopId = (id) => {
  return `{
    stop(id: "HSL:${id}") {
      name
      stoptimesWithoutPatterns {
        scheduledArrival
        realtimeArrival
        arrivalDelay
        scheduledDeparture
        realtimeDeparture
        departureDelay
        realtime
        realtimeState
        serviceDay
        headsign
        trip {
          routeShortName
          tripHeadsign

        }
      }
    }
  }`;
};

const getQueryForStopsByLocation = (lat, lon) => {
  return `{
    stopsByRadius(lat: ${lat}, lon: ${lon}, radius: 600, first: 10) {
      edges {
        node {
          stop {
            code
            gtfsId
            name
            lat
            lon
            stoptimesWithoutPatterns {
              scheduledArrival
              realtimeArrival
              arrivalDelay
              scheduledDeparture
              realtimeDeparture
              departureDelay
              realtime
              realtimeState
              serviceDay
              headsign
              trip {
                tripHeadsign
                routeShortName
              }
            }
          }
          distance
        }
        cursor
      }
      pageInfo {
          hasNextPage
          endCursor
      }
    }
  }`;
};
const getQueryForNextRidesByLocation = (lat, lon) => {
  return `{
  nearest(lat: ${lat}, lon: ${lon}, maxDistance: 600, filterByModes: BUS) {
    edges {
      node {
        place {
          ...on DepartureRow {
            stop {
              lat
              lon
              name
              code
            }
            stoptimes (numberOfDepartures:5, timeRange: 10000 ) {
              serviceDay
              scheduledDeparture
              realtimeDeparture
              realtimeArrival
              trip {
                route {
                  shortName
                  longName
                }
              }
              headsign
            }
          }
        }
        distance
      }
    }
  }
}`;
};
const HSLData = {apiUrl, getQueryForNextRidesByStopId, getQueryForStopsByLocation, getQueryForNextRidesByLocation};
export default HSLData;
