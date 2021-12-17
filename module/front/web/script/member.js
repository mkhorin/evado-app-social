'use strict';

Vue.component('member', {
    props: {
        member: String
    },
    data () {
        return {
            id: null,
            avatar: null,
            name: null,
            photoCounter: null,
            friendStatus: null,
            friendStatusTitle: null,
            activeTab: 'albums'
        };
    },
    computed: {
        notFriend () {
            return this.friendStatus === 'no';
        },
        statusCss () {
            return this.friendStatus ? `status-${this.friendStatus}` : '';
        }
    },
    async created () {
        await this.load();
    },
    methods: {
        onInvite () {
            this.$refs.invitationModal.show();
        },
        async onSendInvitation () {
            const form = this.$refs.invitationForm;
            if (form.validate()) {
                this.$refs.invitationModal.hide();
                this.invite(form.getValue('text'));
            }
        },
        async invite (text) {
            try {
                const result = await this.fetchText('utility', {
                    id: 'inviteFriend',
                    meta: 'member',
                    model: this.member,
                    text
                });
                this.load();
            } catch (err) {
                this.showError(err);
            }
        },
        async load () {
            const data = await this.fetchJson('read', {
                class: 'member',
                view: 'publicView',
                id: this.member
            });
            this.id = data._id;
            this.avatar = this.getAvatarUrl(data.avatar);
            this.name = data.name;
            this.friendStatus = data.friendStatus;
            this.friendStatusTitle = Jam.t(data.friendStatus_title, 'meta.class.member');
            this.photoCounter = data.photoCounter;
        }
    },
    template: '#member'
});