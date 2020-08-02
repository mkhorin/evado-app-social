'use strict';

// evado/web/jam/utility/I18n.js

// extend default translation category
// use: <span data-t="">Some text</span>
// use: <div title="Some text"></div>
// use: <input placeholder="Some text" type="text" />

Object.assign(Jam.I18n.defaults, {

    'Invite to friends': 'Пригласить в друзья'
});

// define custom translation category
// use: <span data-t="custom">Any text</span>
// use: <div data-t="custom" title="Any text"></div>
// use: <input data-t="custom" placeholder="Any text" type="text"/>
// use: <div data-t-title="customTitle" title="Any title" data-t="custom">Any text</div>

Jam.I18n.custom = {

    'Any text': 'Любой текст'
};

Jam.I18n.customTitle = {

    'Any title': 'Любой заголовок'
};

// METADATA

Jam.I18n.meta = {

    'Accept': 'Принять',
    'Accepted': 'Принято',
    'Access': 'Доступ',
    'Album': 'Альбом',
    'Albums': 'Альбомы',
    'All': 'Все',
    'Author': 'Автор',
    'Avatar': 'Аватар',

    'Comment': 'Комментарий',
    'Comments': 'Комментарии',
    'Created at': 'Создано',

    'Decline': 'Отклонить',
    'Declined': 'Отклонено',
    'Description': 'Описание',

    'File': 'Файл',
    'Friend': 'Друг',
    'Friend status': 'Статус друга',
    'Friends': 'Друзья',

    'Incoming invitations': 'Входящие приглашения',
    'Initiator': 'Инициатор',
    'Invitation': 'Приглашение',
    'Invitation sent': 'Приглашение отправлено',
    'Invitations': 'Приглашения',
    'Invitee': 'Приглашенный',

    'Main': 'Главная',
    'Member': 'Участник',
    'Members': 'Участники',
    'My member': 'Мой участник',

    'Name': 'Название',
    'None': 'Нет',
    'Not a friend yet': 'Еще не друг',

    'Outgoing invitations': 'Исходящие приглашения',
    'Own comments': 'Собственные комментарии',
    'Owner': 'Владелец',

    'Pending': 'Ожидание',
    'Photo': 'Фото',
    'Photo counter': 'Счетчик фото',
    'Photos': 'Фото',

    'Recipient': 'Получатель',
    'Related comments': 'Связанные комментарии',

    'Sender': 'Отправитель',
    'Some members': 'Некоторые участники',
    'State': 'Состояние',

    'Text': 'Текст',

    'User': 'Пользователь',

    'Waiting for a response': 'Ожидание ответа'
};

Jam.I18n['meta.class.member'] = {

    'Name': 'Имя'
};