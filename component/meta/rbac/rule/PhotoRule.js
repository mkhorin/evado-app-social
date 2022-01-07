/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

// member can read photo if can read album

module.exports = class PhotoRule extends Base {

    execute () {
        return this.isObjectTarget() ? this.checkAccess() : true;
    }

    async checkAccess () {
        const photo = this.getTarget();
        const albums = photo.get('albums');
        if (!albums.length) {
            return false;
        }
        const meta = photo.class.meta;
        const member = await meta.getClass('member').find({user: this.getUserId()}).id();
        const friendClass = meta.getClass('friend');
        const friends = [
            ...await friendClass.find({invitee: member}).column('initiator'),
            ...await friendClass.find({initiator: member}).column('invitee')
        ];
        const condition = ['or',
            {access: 'all'},
            {access: 'some', members: member},
            {access: 'friends', owner: friends}
        ];
        return !!await meta.getClass('album').findById(albums).and(condition).id();
    }
};