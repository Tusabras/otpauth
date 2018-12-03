import { Request, Response, NextFunction } from "express";
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
let secret = '';

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {

  const { base32, otpauth_url } = speakeasy.generateSecret({length: 20});

  // Deberiamos guardarnos el valor del base32 en la BD de cada usuario.
  // Ejemplo: 
  // base32: MMST4KKLFBCDQL2HEFXDKLSEIJ2TEJBP 
  // otpauth_url: otpauth://totp/SecretKey?secret=MMST4KKLFBCDQL2HEFXDKLSEIJ2TEJBP

  secret = base32;

  QRCode.toDataURL(otpauth_url, function(err:any, image_data:any ) {
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
export let postOTP = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const userToken = req.body.otp;

  // Verificamos que el token del usuario hace match.
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: userToken
  });
  if (!verified) req.flash("errors", { msg: "El código proporcionado es incorrecto!" });
  else req.flash("success", { msg: "El código proporcionado es correcto!" });
  res.redirect(req.session.returnTo || "/");
};
