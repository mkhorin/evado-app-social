'use strict';

Vue.component('album', {
    props: {
        album: String
    },
    data () {
        return {
            id: null,
            name: null,
            description: null,
            member: null
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        async load () {
            const data = await this.fetchJson('read', {
                class: 'album',
                view: 'memberAlbum',
                id: this.album
            });
            this.id = data._id;
            this.name = data.name;
            this.description = data.description;
            this.member = data.owner;
        }
    },
    template: '#album'
});