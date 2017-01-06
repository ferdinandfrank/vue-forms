<?php

return [

    'error' => [
        'delete' => [
            'title'   => 'Sorry',
            'content' => 'Beim Löschen von :name ist ein unbekannter Fehler aufgetreten. Bitte versuche es noch einmal.'
        ],
        'post'   => [
            'title'   => 'Sorry!',
            'content' => 'Beim Erstellen ist ein unbekannter Fehler aufgetreten. Bitte versuche es noch einmal.'
        ],
        'put'    => [
            'title'   => 'Sorry!',
            'content' => 'Beim Aktualisieren von :name ist ein unbekannter Fehler aufgetreten. Bitte versuche es noch einmal.'
        ]
    ],

    'default' => [
        'delete' => [
            'title'   => 'Gelöscht',
            'content' => ':name wurde erfolgreich gelöscht.'
        ],
        'post'   => [
            'title'   => 'Gespeichert',
            'content' => 'Die Daten wurden gespeichert.'
        ],
        'put'    => [
            'title'   => 'Gespeichert',
            'content' => 'Die Änderungen an :name wurden gespeichert.'
        ]
    ],

];
