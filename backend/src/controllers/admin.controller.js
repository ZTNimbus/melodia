import Song from "../models/song.model.js";
import Album from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

async function uploadToCloudinary(file) {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });

    return result.secure_url;
  } catch (error) {
    console.log("cloudinary upload error", error);

    throw new Error("Error when uploading to Cloudinary");
  }
}

async function checkAdmin(rqe, res, next) {
  res.status(200).json({ admin: true });
}

async function createSong(req, res, next) {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile)
      return res
        .status(400)
        .json({ message: "Both image and audio file is required." });

    const { title, artist, albumId, duration } = req.body;

    const audio = req.files.audioFile;
    const image = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audio);
    const imageUrl = await uploadToCloudinary(image);

    const song = new Song({
      title,
      artist,
      imageUrl,
      audioUrl,
      duration: parseInt(duration),
      albumId: albumId || null,
    });

    await song.save();

    //Add to album's songs list if the new songs belongs to an album
    if (albumId)
      await Album.findByIdAndUpdate(albumId, {
        $push: {
          songs: song._id,
        },
      });

    res.status(201).json(song);
  } catch (error) {
    console.log("song create error", error);
    next(error);
  }
}

async function deleteSong(req, res, next) {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Successfully deleted song" });
  } catch (error) {
    console.log("song delete error", error);

    next(error);
  }
}

async function createAlbum(req, res, next) {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      releaseYear,
      imageUrl,
    });

    await album.save();

    res.status(201).json(album);
  } catch (error) {
    console.log("create album error", error);

    next(error);
  }
}

async function deleteAlbum(req, res, next) {
  const { id } = req.params;

  try {
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Successfully deleted albm" });
  } catch (error) {
    console.log("delete album error", error);

    next(error);
  }
}

export { createSong, deleteSong, createAlbum, deleteAlbum, checkAdmin };
