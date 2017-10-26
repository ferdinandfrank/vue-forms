
<?php

return [

    'error' => [
        'delete' => [
            'title'   => 'Sorry',
            'message' => 'An error occurred while trying to delete :name. Please try again.'
        ],
        'post'   => [
            'title'   => 'Sorry!',
            'message' => 'An error occurred while trying to save the data. Please try again.'
        ],
        'put'    => [
            'title'   => 'Sorry!',
            'message' => 'An error occurred while trying to update :name. Please try again.'
        ]
    ],

    'default' => [
        'delete' => [
            'title'   => 'Deleted',
            'message' => ':name has been deleted.'
        ],
        'post'   => [
            'title'   => 'Saved',
            'message' => 'The data has been saved.'
        ],
        'put'    => [
            'title'   => 'Saved',
            'message' => 'The changes on :name have been saved.'
        ]
    ]

];
