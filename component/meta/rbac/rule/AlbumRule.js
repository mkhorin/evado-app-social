/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 *
 * Member can read albums in All access
 * Member can read albums in Friend access if he is a friend of the owner
 * Member can read albums in Some access if he is in the member list
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

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
        const friendClass = album.class.meta.getClass('friend');
        const query = friendClass.find({
            initiator: friends,
            invitee: friends
        });
        return !!await query.id();
    }

    async checkSomeAccess (album) {
        const member = await this.getUserMemberId();
        const members = album.get('members');
        return ArrayHelper.includes(member, members);
    }

    getUserMemberId () {
        const user = this.getUserId();
        return this.getBaseMeta().getClass('member').find({user}).id();
    }

    /**
     * Filter objects in list
     */
    async getObjectFilter () {
        const member = await this.getUserMemberId();
        const meta = this.getBaseMeta();
        const albumClass = meta.getClass('album');
        const albumQuery = albumClass.find({
            access: 'some',
            members: member
        });
        const albums = await albumQuery.ids();
        const friendClass = meta.getClass('friend');
        const initiators = await friendClass.find({invitee: member}).column('initiator');
        const invitees = await friendClass.find({initiator: member}).column('invitee');
        const friends = [...initiators, ...invitees];
        if (friends.length) {
            const query = albumClass.find({
                access: 'friends',
                owner: friends
            });
            const ids = await query.ids();
            albums.push(...ids);
        }
        return albums.length
            ? ['or', {access: 'all'}, {[albumClass.getKey()]: albums}]
            : {access: 'all'};
    }
};

const ArrayHelper = require('areto/helper/ArrayHelper');