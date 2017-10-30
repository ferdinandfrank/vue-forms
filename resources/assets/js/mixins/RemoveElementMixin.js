export default {

    props: {

        // The selector of the element to remove.
        remove: {
            type: String
        }
    },

    data() {
        return {
            removeSelector: this.remove,
        }
    },

    methods: {
        removeElement: function () {
            if (this.removeSelector) {
                let removeElement = $(this.removeSelector);

                removeElement.hide('slow', function () {
                    removeElement.remove();
                });
            }
        }
    }
};

