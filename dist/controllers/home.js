"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
let secret = '';
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    const { base32, otpauth_url } = speakeasy.generateSecret({ length: 20 });
    // console.log(base32, otpauth_url); // Save this value to your DB for the user
    // Example: 
    // base32: MMST4KKLFBCDQL2HEFXDKLSEIJ2TEJBP 
    // otpauth_url: otpauth://totp/SecretKey?secret=MMST4KKLFBCDQL2HEFXDKLSEIJ2TEJBP
    secret = base32;
    QRCode.toDataURL(otpauth_url, function (err, image_data) {
        res.render("home", {
            title: "Home",
            qrImageData: image_data,
        });
    });
};
/**
 * POST /home
 * Sign in using email and password.
 */
exports.postOTP = (req, res, next) => {
    console.log(req.body);
    // This is provided the by the user via form POST
    const userToken = req.body.otp;
    // Verify that the user token matches what it should at this moment
    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: userToken
    });
    if (!verified)
        req.flash("errors", { msg: "El código proporcionado es incorrecto!" });
    else
        req.flash("success", { msg: "El código proporcionado es correcto!" });
    res.redirect(req.session.returnTo || "/");
    // req.assert("otp", "El codigo no puede estar vacio").notEmpty();
    // const errors = req.validationErrors();
    // if (errors) {
    //   req.flash("errors", errors);
    //   return res.redirect("/login");
    // }
    // passport.authenticate("local", (err: Error, user: UserModel, info: IVerifyOptions) => {
    //   if (err) { return next(err); }
    //   if (!user) {
    //     req.flash("errors", info.message);
    //     return res.redirect("/login");
    //   }
    //   req.logIn(user, (err) => {
    // if (err) { return next(err); }
    // req.flash("success", { msg: "Success! You are logged in." });
    // res.redirect(req.session.returnTo || "/");
    //   });
    // })(req, res, next);
};
//# sourceMappingURL=home.js.map