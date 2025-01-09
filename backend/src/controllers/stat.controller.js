import Song from "../models/song.model.js";
import User from "../models/user.model.js";
import Album from "../models/album.model.js";

async function getStats(req, res, next) {
  try {
    const [totalSongsCount, totalUsersCount, totalAlbumsCount, uniqueArtists] =
      await Promise.all([
        Song.countDocuments(),
        User.countDocuments(),
        Album.countDocuments(),

        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },

          {
            $group: {
              _id: "$artist",
            },
          },

          { $count: "count" },
        ]),
      ]);

    res.status(200).json({
      totalSongsCount,
      totalUsersCount,
      totalAlbumsCount,
      totalArtistsCount: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    console.log("error", error);

    next(error);
  }
}

export { getStats };
