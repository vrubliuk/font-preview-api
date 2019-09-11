const fs = require("fs");
const text2png = require("text2png");
const uniqId = require("uniqid");
const isDecimal = require("validator/lib/isDecimal");
const fonts = require("../fonts");

exports.getImage = async (req, res, next) => {
  let { fontSize, handwritingStyleId, text } = req.query;

  if (!fontSize) return next(new Error("Font size is required"));
  if (!isDecimal(fontSize)) return next(new Error("Font size should be a decimal"));
  if (!handwritingStyleId) return next(new Error("Handwriting style is required"));
  if (!text.trim()) return next(new Error("Text is required"));

  fontSize = Number(fontSize.trim());
  handwritingStyleId = Number(handwritingStyleId);
  text = text
    .trim()
    .split("\n")
    .map(row => row.padStart(row.length + Math.floor(Math.random() * 6)))
    .join("\n");

  let font = fonts.find(font => font.id === handwritingStyleId);
  if (!font) return next(new Error("Font is not found"));

  try {
    const imagePath = `${uniqId()}.png`;
    fs.writeFile(
      imagePath,
      text2png(text, {
        font: `${fontSize}px '${font.label}'`,
        localFontPath: `fonts/files/${font.fileName}`,
        localFontName: `${font.label}`,
        padding: 20,
        color: "teal",
        backgroundColor: "linen"
      }),
      err => {
        if (err) throw err;
        res.download(imagePath, err => {
          if (err) throw err;
          fs.unlink(imagePath, err => {
            if (err) throw err;
          });
        });
      }
    );
  } catch (err) {
    next(err);
  }
};
