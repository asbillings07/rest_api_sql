const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('../models').User;
// authentcation for users
const authenticateUser = async (req, res, next) => {
  // Parse the user's credentials from the Authorization header.
  const creds = auth(req);
  // If the user's credentials are available...
  // Attempt to retrieve the user from the data store
  if (creds) {
    const user = await User.findOne({
      where: { emailAddress: creds.name },
    }).catch(err => console.log(err));

    if (user) {
      const authed = bcryptjs.compareSync(creds.pass, user.password);

      if (authed) {
        req.currentUser = user;
        next();
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
        res.status(401).json({ message: 'Access Denied', error: message });
      }
    } else {
      message = `User not found for username: ${creds.name}`;
      res.status(401).json({ message: 'Access Denied', error: message });
    }
  } else {
    message = 'Auth header not found';
    res.status(401).json({ message: 'Access Denied', error: message });
  }
};
exports.authenticateUser = authenticateUser;
