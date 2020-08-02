'use strict';

Front.Photo = class Photo extends Front.LoadableContent {

    getUrl (action = 'read') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'photo',
            view: 'albumPhoto',
            id: this.id
        };
    }

    render (data) {
        data.album = this.album;
        return this.resolveTemplate('photo', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};

Front.PhotoList = class PhotoList extends Front.LoadableContent {

    init () {
        super.init();
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 8;
        this.on('change:pagination', this.onChangePagination.bind(this));
    }

    getUrl (action = 'list') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'photo',
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

    onDetail (event) {
        event.preventDefault();
        const {id, task, state} = $(event.currentTarget).closest('.task-item').data();
        const action = state === 'draft' ? 'fillForm' : 'request';
        this.front.trigger(`action:${action}`, {id, task});
    }
};

Front.AlbumPhotoList = class AlbumPhotoList extends Front.PhotoList {

    init () {
        super.init();
        this.album = this.getData('album');
        this.load();
    }

    getUrl (action = 'list-related') {
        return super.getUrl(action);
    }

    getPostData () {
        return Object.assign(super.getPostData(), {
            //view: 'memberAlbum',
            master: {
                id: this.album,
                class: 'album',
                attr: 'photos'
            }
        });
    }

    renderItem (data) {
        return this.resolveTemplate('item', data);
    }
};