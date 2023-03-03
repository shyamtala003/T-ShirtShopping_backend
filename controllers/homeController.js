exports.homeCotroller = (req, res) => {
  res.status(200).json({
    success: true,
    message: "home page",
  });
};

exports.login = (req, res) => {
  res.status(200).json({
    success: true,
    message: "login page",
  });
};
