import Album from "../models/album.model.js";

async function getAllAlbums(req, res, next) {
  try {
    const albums = await Album.find();

    res.status(200).json(albums);
  } catch (error) {
    console.log("get all albums error", error);
    next(error);
  }
}

async function getAlbum(req, res, next) {
  const { id } = req.params;

  try {
    const album = await Album.findById(id).populate("songs");

    if (!album) return res.status(404).json({ message: "Album not found" });

    res.status(200).json(album);
  } catch (error) {
    console.log("get album error", error);

    next(error);
  }
}

export { getAllAlbums, getAlbum };
