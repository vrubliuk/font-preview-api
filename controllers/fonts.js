const fonts = require("../fonts");

exports.getFonts = async (req, res, next) => {
 res.json({
   fonts
 })
};