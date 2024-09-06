export default class SessionController {
    // Generar un token
    login(req, res) {
        try {
            const token = req.token ?? req.cookies["token"] ?? null;
            res.sendSuccess201(token);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Obtener el usuario que actualmente ha iniciado sesión
    getCurrentUser(req, res) {
        try {
            const user = {
                id: req.id,
                roles: req.roles,
                email: req.email,
            };

            res.sendSuccess200(user);
        } catch (error) {
            res.sendError(error);
        }
    }
}