import jwt from "jsonwebtoken";
import passport from "passport";
import UserService from "../services/user.service.js";
import { JWT_TRANSLATIONS } from "../constants/messages.constant.js";

const userService = new UserService();

// Middleware para generar un token de acceso para un usuario autenticado
export const generateToken = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userFound = await userService.findOneByEmailAndPassword(email, password);
        const token = jwt.sign({ id: userFound.id }, process.env.SECRET_KEY, { expiresIn: "2h" });

        req.token = token;
        res.cookie("token", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });

        next();

    } catch (error) {
        next(error);
    }
};

// Middleware para verificar la autenticación del usuario
export const checkAuth = (req, res, next) => {
    const jwtStrategy = req.cookies["token"] ? "jwt-cookie" : "jwt-header";

    passport.authenticate(jwtStrategy, { session: false }, (error, user, info) => {
        if (error) return next(error);

        if (!user) {
            return next(new Error(JWT_TRANSLATIONS[info.message] ?? info.message));
        }

        req.id = user.id;
        req.roles = user.roles;
        req.email = user.email;
        req.user = user;

        next();
    })(req, res, next);
};