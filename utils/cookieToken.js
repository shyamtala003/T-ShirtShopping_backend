const cookieToken = (user, res) => {
  const token = user.generateJwtToken();

  // remove password from response
  user.password = undefined;
  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      token,
      user,
    });
};

module.exports = cookieToken;
