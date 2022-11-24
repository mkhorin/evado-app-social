'use strict';

Vue.component('comments-album', {
    extends: Vue.component('comments'),
    props: {
        album: String
    },
    methods: {
        getMasterData () {
            return {
                class: 'album',
                attr: 'comments',
                id: this.album
            };
        },
        setOwnerLink (data) {
            data.album = this.album;
        }
    }
});