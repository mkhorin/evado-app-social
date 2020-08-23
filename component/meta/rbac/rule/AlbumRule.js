/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

// member can read albums in All access
// member can read albums in Friend access if he is a friend of the owner
// member can read albums in Some access if he is in the member list

module.exports = class AlbumRule extends Base {

    execute () {
        return this.isObjectTarget() ? this.checkAccess() : true;
    }

    async checkAccess () {
        const album = this.getTarget();
        switch (album.get('access')) {
            case 'all': return true;
            case 'friends': return this.checkFriendAccess(album);
            case 'some': return this.checkSomeAccess(album);
        }
        return false;
    }

    async checkFriendAccess (album) {
        const member = await this.getUserMemberId();
        const friends = [member, album.get('owner')];
        return !!await album.class.meta.getClass('friend').find().and({
            initiator: friends,
            invitee: friends
        }).id();
    }

    async checkSomeAccess (album) {
        const member = await this.getUserMemberId();
        return ArrayHelper.includes(member, album.get('members'));
    }

    getUserMemberId () {
        return this.getBaseMeta().getClass('member').find().and({user: this.getUserId()}).id();
    }

    async getObjectFilter () { // filter objects in list
        const member = await this.getUserMemberId();
        const meta = this.getBaseMeta();
        const albumClass = meta.getClass('album');
        const albums = await albumClass.find().and({
            access: 'some',
            members: member
        }).ids();
        const friendClass = meta.getClass('friend');
        const friends = [
            ...await friendClass.find().and({invitee: member}).column('initiator'),
            ...await friendClass.find().and({initiator: member}).column('invitee')
        ];
        if (friends.length) {
            albums.push(...await albumClass.find().and({
                access: 'friends',
                owner: friends
            }).ids());
        }
        return albums.length
            ? ['OR', {access: 'all'}, {[albumClass.getKey()]: albums}]
            : {access: 'all'};
    }
};

const ArrayHelper = require('areto/helper/ArrayHelper');