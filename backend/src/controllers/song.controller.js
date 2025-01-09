import Song from "../models/song.model.js";

async function getAllSongs(req, res, next) {
  try {
    //-1 === newest first
    const songs = await Song.find().sort({ createdAt: -1 });

    res.status(200).json(songs);
  } catch (error) {
    console.log("get all songs error", error);

    next(error);
  }
}

async function getFeaturedSongs(req, res, next) {
  try {
    const featuredSongs = await Song.aggregate([
      { $sample: { size: 6 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.status(200).json(featuredSongs);
  } catch (error) {
    console.log("get featured songs error", error);

    next(error);
  }
}

async function getMadeForYou(req, res, next) {
  try {
    const madeForYouSongs = await Song.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.status(200).json(madeForYouSongs);
  } catch (error) {
    console.log("get made for you error", error);

    next(error);
  }
}

async function getTrending(req, res, next) {
  try {
    const trendingSongs = await Song.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.status(200).json(trendingSongs);
  } catch (error) {
    console.log("get trending songs error", error);

    next(error);
  }
}

async function getSong(req, res, next) {
  const { id } = req.params;

  try {
    const song = await Song.findById(id);

    res.status(200).json(song);
  } catch (error) {
    console.log("get song error", error);

    next(error);
  }
}

export { getAllSongs, getFeaturedSongs, getMadeForYou, getTrending, getSong };
