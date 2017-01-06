
<?php

return [

    'error' => [
        'delete' => [
            'title'   => 'Sorry',
            'content' => 'An error occurred while trying to delete :name. Please try again.'
        ],
        'post'   => [
            'title'   => 'Sorry!',
            'content' => 'An error occurred while trying to save the data. Please try again.'
        ],
        'put'    => [
            'title'   => 'Sorry!',
            'content' => 'An error occurred while trying to update :name. Please try again.'
        ]
    ],

    'default' => [
        'delete' => [
            'title'   => 'Deleted',
            'content' => ':name has been deleted.'
        ],
        'post'   => [
            'title'   => 'Saved',
            'content' => 'The data has been saved.'
        ],
        'put'    => [
            'title'   => 'Saved',
            'content' => 'The changes on :name have been saved.'
        ]
    ]

];
