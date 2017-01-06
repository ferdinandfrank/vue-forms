module.exports = {
    props: {
        // The value of the date picker.
        // See property 'submitDate'.
        date: {
            type: String,
            default: ''
        },

        // The range of the date picker, i.e. which dates can be selected.
        // Valid values: 'all', 'past' (Before today), 'future' (After today)
        range: {
            type: String,
            default: 'all'
        }
    },
};

