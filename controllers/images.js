const fs = require("fs");
const text2png = require("text2png");
const images = require("images");
const uniqId = require("uniqid");
const isDecimal = require("validator/lib/isDecimal");
const fonts = require("../fonts");

exports.getImage = async (req, res, next) => {
  let { fontSize, width, handwritingStyleId, text } = req.query;

  if (!fontSize) return next(new Error("Font size is required"));
  if (!isDecimal(fontSize)) return next(new Error("Font size should be a decimal"));
  if (!width) return next(new Error("Width is required"));
  if (!isDecimal(width)) return next(new Error("Width should be a decimal"));
  if (!handwritingStyleId) return next(new Error("Handwriting style is required"));
  if (!text.trim()) return next(new Error("Text is required"));

  fontSize = Number(fontSize.trim());
  width = Number(width.trim());
  handwritingStyleId = Number(handwritingStyleId);
  text = text.trim();

  const textRows = text.split("\n").filter(row => row !== "");
  
  let font = fonts.find(font => font.id === handwritingStyleId);  
  if (!font) return next(new Error("Font is not found"));

  const image = images(width, (fontSize + 5) * textRows.length);

  try {
    textRows.forEach((row, i) => {
      const midImagePath = `${uniqId()}.png`;
      fs.writeFileSync(
        midImagePath,
        text2png(row, {
          font: `${fontSize}px '${font.label}'`,
          localFontPath: `fonts/files/${font.fileName}`,
          localFontName: `${font.label}`
        })
      );
      image.draw(images(midImagePath), 5 + 15 * Math.random(), 5 + (fontSize + 5) * i);
      fs.unlink(midImagePath, err => {
        if (err) throw err;
      });
    });

    const finalImagePath = `final-${uniqId()}.png`;
    image.save(finalImagePath, {
      quality: 100
    });

    res.download(finalImagePath, downloadError => {
      if (downloadError) throw downloadError;
      fs.unlink(finalImagePath, deletionError => {
        if (deletionError) throw deletionError;
      });
    });
  } catch (err) {
    next(err);
  }
};
