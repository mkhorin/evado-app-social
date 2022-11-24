'use strict';

Vue.component('comments-photo', {
    extends: Vue.component('comments'),
    props: {
        photo: String
    },
    methods: {
        getMasterData () {
            return {
                class: 'photo',
                attr: 'comments',
                id: this.photo
            };
        },
        setOwnerLink (data) {
            data.photo = this.photo;
        }
    }
});