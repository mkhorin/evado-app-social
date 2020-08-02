'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        roles: 'administrator',
        type: 'allow',
        actions: 'all',
        targets: {type: 'all'}
    }, {
        description: 'Guest access',
        roles: 'guest',
        type: 'allow',
        actions: 'read',
        targets: [{
            type: 'class',
            class: 'avatar'
        }, {
            type: 'view',
            class: 'member',
            view: 'publicList'
        }]
    }, {
        roles: 'member',
        type: 'allow',
        actions: 'read',
        targets: [{
            type: 'class',
            class: ['avatar', 'comment', 'friend']
        }, {
            type: 'view',
            class: 'member',
            view: ['publicList', 'publicView', 'title']
        }]
    }, {
        description: 'User can read allowed albums',
        roles: 'member',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'album'
        },
        rule: 'Album'
    }, {
        description: 'User can read allowed photos',
        roles: 'member',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'photo'
        },
        rule: 'Photo'
    }, {
        description: 'User can manage his own objects',
        roles: 'member',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'class',
            class: ['album', 'photo']
        },
        rule: 'Owner user'
    }, {
        description: 'User can change invitations he receives',
        roles: 'member',
        type: 'allow',
        actions: ['read', 'update'],
        targets: {
            type: 'class',
            class: 'invitation'
        },
        rule: 'Recipient user'
    }, {
        description: 'User can change his own member',
        roles: 'member',
        type: 'allow',
        actions: ['read', 'update'],
        targets: {
            type: 'class',
            class: 'member'
        },
        rule: 'User'
    }, {
        description: 'User can manage objects he created',
        roles: 'member',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'class',
            class: ['avatar', 'comment', 'invitation']
        },
        rule: 'Creator user'
    }, {
        description: 'User can delete friendship',
        roles: 'member',
        type: 'allow',
        actions: 'delete',
        targets: {
            type: 'class',
            class: 'friend'
        },
        rule: 'Friend deletion'
    }],

    permissions: {
        ...parent.permissions,

        'moduleAdmin': {
            label: 'Admin module'
        },
        'moduleOffice': {
            label: 'Office module'
        },
        'moduleStudio': {
            label: 'Studio module'
        },
        'utilityInviteFriend': {
            label: 'Invite friend utility',
            description: 'Invite to friends'
        }
    },

    roles: {
        'administrator': {
            label: 'Administrator',
            description: 'Full access to all',
            children: [
                'moduleAdmin',
                'moduleOffice',
                'moduleStudio'
            ]
        },
        'guest': {
            label: 'Guest',
            description: 'Auto-assigned role for unauthenticated users'
        },
        'member': {
            label: 'Member',
            description: 'Default role for registered users',
            children: [
                'moduleOffice',
                'utilityInviteFriend'
            ]
        }
    },
    // bind users to roles
    assignments: {
        'Adam': 'administrator'
    },

    rules: {
        'Album': {
            description: 'Check user access to read album',
            config: '{"Class": "component/meta/rbac/rule/AlbumRule"}'
        },
        'Creator user': {
            description: 'Check user binding as object creator',
            config: '{"Class": "evado/component/meta/rbac/rule/UserRule", "attr": "_creator"}'
        },
        'Friend deletion': {
            description: 'Check that user belongs to the friend to be deleted',
            config: '{"Class": "component/meta/rbac/rule/FriendDeletionRule"}'
        },
        'Owner user': {
            description: 'Check user is owner',
            config: '{"Class": "evado/component/meta/rbac/rule/RefUserRule", "attr": "owner"}'
        },
        'Photo': {
            description: 'Check user access to read photo',
            config: '{"Class": "component/meta/rbac/rule/PhotoRule"}'
        },
        'Recipient user': {
            description: 'Check user is recipient',
            config: '{"Class": "evado/component/meta/rbac/rule/RefUserRule", "attr": "recipient"}'
        },
        'User': {
            description: 'Check user binding',
            config: '{"Class": "evado/component/meta/rbac/rule/UserRule"}'
        }
    }
};