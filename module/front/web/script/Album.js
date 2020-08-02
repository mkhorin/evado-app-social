'use strict';

Front.Album = class Album extends Front.LoadableContent {

    getUrl (action = 'read') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'album',
            view: 'memberAlbum',
            id: this.id
        };
    }

    render (data) {
        return this.resolveTemplate('album', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};

Front.AlbumList = class AlbumList extends Front.LoadableContent {

    init () {
        super.init();
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 9;
        this.on('change:pagination', this.onChangePagination.bind(this));
    }

    getUrl (action = 'list') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'album',
            view: 'list',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize()
        };
    }

    onChangePagination () {
        this.load();
    }

    resolveTemplate (name, data) {
        return super.resolveTemplate(name, data, '##', '##');
    }

    render (data) {
        let items = data && data.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return this.resolveTemplate(items ? 'list' : 'empty', {items});
    }

    renderItem (data) {
        data.owner = data.owner._title;
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDone (data) {
        super.onDone(data);
        this.pagination.setTotal(data && data.totalSize);
        this.$content.append(this.pagination.render());
        this.translateContainer();
    }
};

Front.MemberAlbumList = class MemberAlbumList extends Front.AlbumList {

    init () {
        super.init();
        this.member = this.getData('member');
        this.load();
    }

    getUrl (action = 'list-related') {
        return super.getUrl(action);
    }

    getPostData () {
        return Object.assign(super.getPostData(), {
            view: 'memberAlbum',
            master: {
                id: this.member,
                class: 'member',
                attr: 'albums'
            }
        });
    }

    renderItem (data) {
        return this.resolveTemplate('item', data);
    }
};