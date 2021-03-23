/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.MemberList = class MemberList extends Front.Loadable {

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
        this.pagination.setTotal(data?.totalSize);
        this.$content.append(this.pagination.render());
        Jam.t(this.$container);
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('warning', {text: Jam.t(this.noItemsFound)});
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