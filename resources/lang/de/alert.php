<?php

return [

    'error' => [
        'delete' => [
            'title'   => 'Sorry',
            'message' => 'Beim Löschen von :name ist ein unbekannter Fehler aufgetreten. Bitte versuche es noch einmal.'
        ],
        'post'   => [
            'title'   => 'Sorry!',
            'message' => 'Beim Erstellen ist ein unbekannter Fehler aufgetreten. Bitte versuche es noch einmal.'
        ],
        'put'    => [
            'title'   => 'Sorry!',
            'message' => 'Beim Aktualisieren von :name ist ein unbekannter Fehler aufgetreten. Bitte versuche es noch einmal.'
        ]
    ],

    'default' => [
        'delete' => [
            'title'   => 'Gelöscht',
            'message' => ':name wurde erfolgreich gelöscht.'
        ],
        'post'   => [
            'title'   => 'Gespeichert',
            'message' => 'Die Daten wurden gespeichert.'
        ],
        'put'    => [
            'title'   => 'Gespeichert',
            'message' => 'Die Änderungen an :name wurden gespeichert.'
        ]
    ],

];
