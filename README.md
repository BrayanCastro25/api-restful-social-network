# api-restful-social-network

This repository consists of a RESTful API for a social network.

* Contiene 3 modelos uno para los usuarios, seguimientos y publicaciones.

### Modelo User

* /register Permite el registro de un usuario, validando si se envían datos importantes como el name, nick, email y password (se le realiza su respectiva conversión a Hash).

* /login Realiza el loguin de un usuario, validando que coincidan el email y password en la base de datos de MongoDB.

* /profile Visualiza datos del usuario como los usuarios que sigue y que usuarios lo siguen.

* /list Lista todos los usuarios registrados en la red social.

* /update Actualiza los datos de un usuario.

* /upload Permite subir una foto del usuario.

* /avatar Visualiza la imagen de un usuario.

* /counter Visualiza la cantidad de usuarios que sigue, la cantidad de usuarios que lo siguen y las publicaciones que ha realizado un usuario.

### Model Follows

* /save Almacena un follow de un usuario a otro (Acción de seguir).

* /unfollow Elimina el follow de un usuario a otro (Acción de dejar de seguir).

* /following Lista los usuarios que yo estoy siguiendo.

* /followers Lista los usuarios que me siguen.

### Model Publications

* /save Guarda una publicación de un usuario.

* /detail Muestra una publicación específica.

* /remove Elimina una publicación.

* /user Lista todas las publicaciones que ha realizado un usuario.

* /upload Almacena una imagen de una publicación.

* /media Permite visualizar una imagen específica.

* /feed Muestra todas las publicaciones realizadas por todos los usuarios que estoy siguiendo.