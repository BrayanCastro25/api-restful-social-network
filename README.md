# api-restful-social-network
This repository consists of a RESTful API for a social network.


- Realiza la consulta con mongoose a la base de datos para autenticar las credenciales del usuario.
- A partir de un token y una clave secreta, comprueba antes mediante un middleware si el token aún no ha expirado para darle acceso a una ruta específica del usuario.