# TODO

## Done

- ~~Recarga de noticias tirando~~
- ~~**MUY IMPORTANTE** Ajustar alignment de QR y botón para que el botón se vea bien en pantallas pequeñas~~
- ~~Configurar splash screen para que logo no salga deforme~~
- ~~Deslizar en schedule entre tabs => Hay que mejorarlo, pq la height se queda justa cuando carga y no puedes bajar~~


## Beta release

1. _**IMPORTANTE**_ Corregir el tamaño de las barras del horario.
1. Poner el logo como icono de la App
1. Aviso Página de mecenas y colaboradores. FALTA: traducción, que la he desarrollado yo, link al github.
1. Notificación que salte cada vez que abres la app (y que puedas cerrar hasta la próxima vez que la abras) avisándote si la app está deprecated.
1. Que hasta la semana en sí del evento siempre te ponga en el día 19 en schedule
1. View de cada evento
1. Notificaciones Push => data/campo personalizado del icono que venga en la push y si no hay o no encuentra fallback a avioncito de papel

## Others

1. Restringir carácteres para introducir en QR ~~=> Primero seleccionar entre tipo de identificación (DNI/NIE/Pasaporte) y después input del mismo~~
1. Menú de configuración: para notificaciones, [modo oscuro], cambiar DNI (quitar de donde el QR) ...
1. _SIMPLE_ Hacer que el botón atrás te saque de la aplicación si estás en una de las pantallas principales
1. **IMPORTANTE** Carga dinámica de noticias
1. Aclarar mensaje notificaciones
1. (View in-app de noticias)
1. ~~Cache noticias + (solo requerir online primera vez)~~
1. Cache horario + (solo requerir online primera vez)
1. Local notifications: notificaciones locales para el evento
1. Translations
1. Haptics for toasts
1. Vista detallada de cada evento
1. Posibilidad de borrar las notificaciones (y algo super pro sería que a la hora de mandarlas pudieras elegir si se quedan guardadas o no)
1. Diferenciar de alguna forma si los logos de los mecenas pertenecen a la categoría indicada encima del logo o debajo del logo.

## Next congress

1. Que no aparezca un encabezado si no hay logos para ese encabezado.

# SENDING NOTIFICATIONS PROGRAMATICALLY:

```bash
curl -X POST --header "Authorization: key=AAAAUUO-Fps:APA91bEJpuWqhxT9ZvLJ0ficdf1u-dhL8j-Nn9eYb5wUNoer_hpNmJy7AyCp-NCRvNzq-VX21PSY2fshqZLAN_wrqHOjqqF9PUCBRO8MBWkT4S0qZPqTdzv3kf9y3gU5gp83QkdHM7VF " --Header "Content-Type: application/json" https://fcm.googleapis.com/fcm/send -d "{\"to\":\"d4S6-vIURlWhLSkQDcid4X:APA91bFO_vC5xRYT2MO75aWr0kUwkAswGjCtEASkxGpP7C4MTpJ8UMe8ZuCtHCDdGp-021MvpGAhiqmUGJsxxZo7zEeBdTEjVT4NNfjGfeUykv4xL8bnGfWqb_MatBWuePXamHe0sRB5\",\"notification\":{\"body\":\"Firebase\"}}"
```
