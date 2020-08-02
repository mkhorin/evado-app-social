'use strict';

Front.Member = class Member extends Front.LoadableContent {

    getUrl () {
        return super.getUrl('read');
    }

    getPostData () {
        return {
            class: 'member',
            view: 'publicView',
            id: this.id
        };
    }

    render (data) {
        data.avatar = this.resolveTemplate(data.avatar ? 'avatar' : 'avatarPlaceholder', data);
        return this.resolveTemplate('member', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};

Front.MemberList = class MemberList extends Front.LoadableContent {

    constructor () {
        super(...arguments);
        this.noItemsFound = 'No members found';
        this.pageSize = 8;
    }

    init () {
        super.init();
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = this.pageSize;
        this.on('change:pagination', this.onChangePagination.bind(this));
        this.load();
    }

    getUrl (action = 'list') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'member',
            view: 'publicList',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize()
        };
    }

    onChangePagination () {
        this.load();
    }

    onDone (data) {
        super.onDone(data);
        this.pagination.setTotal(data && data.totalSize);
        this.$content.append(this.pagination.render());
        this.translateContainer();
    }

    render (data) {
        let items = data && data.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('warning', {text: Jam.i18n.translate(this.noItemsFound)});
    }

    renderItem (data) {
        data.avatar = this.resolveTemplate(data.avatar ? 'avatar' : 'avatarPlaceholder', data);
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};

Front.MemberFriendList = class MemberFriendList extends Front.MemberList {

    constructor () {
        super(...arguments);
        this.member = this.getData('member');
        this.noItemsFound = 'No friends found';
        this.pageSize = 9;
    }

    getUrl (action = 'list-related') {
        return super.getUrl(action);
    }

    getPostData () {
        return Object.assign(super.getPostData(), {
            master: {
                id: this.member,
                class: 'member',
                attr: 'friendMembers'
            }
        });
    }

    resolveTemplate (name, data) {
        return super.resolveTemplate(name, data, '##', '##');
    }
};

Front.Invite = class Invite extends Front.Element {

    init () {
        this.$modal = this.$container;
        this.$modalError = this.$modal.find('.modal-error');
        this.$modal.on('click', '[data-command="send"]', this.onSend.bind(this));
        this.front.on('action:invite', this.onInvite.bind(this));
    }

    onInvite (event, data) {
        this.member = data.member;
        this.$modalError.addClass('hidden');
        this.$modal.modal();
    }

    onSend () {
        const form = this.getHandler('Form');
        if (!form.validate()) {
            return false;
        }
        const data = {
            id: 'inviteFriend',
            meta: 'member',
            model: this.member,
            text: form.getValue('text')
        };
        this.front.ajaxQueue.post(this.getDataUrl('utility'), data)
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (data) {
        this.$modal.modal('hide');
        this.front.getHandler('Member').load();
    }

    onFail (data) {
        this.$modalError.removeClass('hidden').html(data.responseText || data.statusText);
    }
};