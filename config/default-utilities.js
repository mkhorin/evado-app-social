'use strict';

const parent = require('evado/config/default-utilities');

module.exports = {

    ...parent,

    'inviteFriend': {
        Class: 'component/meta/utility/InviteFriendUtility',
        name: 'Invite to friends',
        enabled: true,
        css: 'btn-success',
        clientClass: 'InviteFriend',
        actions: ['update'],
        targetClass: 'member'
    }
};