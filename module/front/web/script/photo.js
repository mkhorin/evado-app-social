'use strict';

Vue.component('photo', {
    props: {
        album: String,
        photo: String
    },
    data () {
        return {
            id: null,
            name: null,
            member: null,
            thumbnail: null,
            text: null
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        async load () {
            const data = await this.fetchJson('read', {
                class: 'photo',
                view: 'albumPhoto',
                id: this.photo
            });
            this.id = data._id;
            this.name = data.name;
            this.thumbnail = this.getThumbnailUrl('photo', this.id);
            this.text = data.text;
            this.member = data.owner;
        }
    },
    template: '#photo'
});