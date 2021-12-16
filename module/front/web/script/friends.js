'use strict';

Vue.component('friends', {
    props: {
        pageSize: {
            type: Number,
            default: 6
        },
        member: String
    },
    data () {
        return {
            items: []
        };
    },
    computed: {
        empty () {
            return !this.items.length;
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const data = await this.fetchJson('list', {
                class: 'member',
                view: 'publicList',
                master: {
                    class: 'member',
                    attr: 'friendMembers',
                    id: this.member
                },
                length: this.pageSize,
                start: page * this.pageSize
            });
            const pageSize = this.pageSize;
            this.$emit('load', {...data, pageSize, page});
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                name: item.name,
                avatar: this.getAvatarUrl(item.avatar),
                photoCounter: item.photoCounter
            }));
        },
    },
    template: '#friends'
});