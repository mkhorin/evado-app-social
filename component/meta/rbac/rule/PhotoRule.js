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
        const {meta} = photo.class;
        const user = this.getUserId();
        const memberClass = meta.getClass('member');
        const memberQuery = memberClass.find({user});
        const member = await memberQuery.id();
        const friendClass = meta.getClass('friend');
        const initiators = await friendClass.find({invitee: member}).column('initiator');
        const invitees = await friendClass.find({initiator: member}).column('invitee'); 
        const friends = [...initiators, ...invitees];
        const condition = ['or',
            {access: 'all'},
            {access: 'some', members: member},
            {access: 'friends', owner: friends}
        ];
        const albumClass = meta.getClass('album');
        const albumQuery = albumClass.findById(albums).and(condition);
        const id = await albumQuery.id();
        return !!id;
    }
};