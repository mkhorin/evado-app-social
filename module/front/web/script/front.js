'use strict';

const front = new Vue({
    el: '#front',
    props: {
        csrf: String,
        authUrl: String,
        dataUrl: String,
        fileUrl: String,
        metaUrl: String,
        thumbnailUrl: String,
        userId: String
    },
    propsData: {
        ...document.querySelector('#front').dataset
    },
    data () {
        return {
            activePage: 'members',
            activeAlbum: null,
            activeMember: null,
            activePhoto: null
        };
    },
    computed: {
        activePageProps () {
            return {
                ...this.defaultPageProps,
                ...this.pagePros
            };
        },
        defaultPageProps () {
            return {
            };
        },
        pagePros () {
            switch (this.activePage) {
                case 'album':
                    return {
                        key: this.activeAlbum,
                        album: this.activeAlbum
                    };
                case 'member':
                    return {
                        key: this.activeMember,
                        member: this.activeMember
                    };
                case 'photo':
                    return {
                        key: this.activePhoto,
                        album: this.activeAlbum,
                        photo: this.activePhoto
                    };
            }
        }
    },
    created () {
        this.$on('album', this.onAlbum);
        this.$on('members', this.onMembers);
        this.$on('member', this.onMember);
        this.$on('photo', this.onPhoto);
    },
    methods: {
        onAlbum (id) {
            if (this.requireAuth()) {
                this.activePage = 'album';
                this.activeAlbum = id;
            }
        },
        onMembers () {
            this.activePage = 'members';
        },
        onMember (id) {
            if (this.requireAuth()) {
                this.activePage = 'member';
                this.activeMember = id;
            }
        },
        onPhoto (id, album) {
            this.activePage = 'photo';
            this.activeAlbum = album;
            this.activePhoto = id;
        }
    }
});