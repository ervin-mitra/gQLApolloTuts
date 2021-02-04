module.exports = {
    Query: {
        launches: (_, __, { dataSources }) => 
            dataSources.launchAPI.getAllLaunches(),
        launch: (_, { id }, { dataSources }) => 
            dataSources.launchAPI.getLaunchById( { launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser
    },
    Mission: {
        // default size is 'LARGE' if not provided
        missionPatch: (mission, {size} = {size: 'LARGE'}) => {
            return size === 'SMALL'
                ? missionPatchSmall
                : missionPatchLarge;
        },
    },
    Launch: {
        isBooked: async (launch, _, { dataSources }) =>
          dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
      },
      User: {
        trips: async (_, __, { dataSources }) => {
          // get ids of launches by user
          const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
          if (!launchIds.length) return [];
          // look up those launches by their ids
          return (
            dataSources.launchAPI.getLaunchesByIds({
              launchIds,
            }) || []
          );
        },
      },
}

/**
 * 4 arguments for GQL resolvers in order:
 * 1. parent
 * 2. arguments - exactly like the name
 * 3. context - shared
 * 4. info - barely used
 */