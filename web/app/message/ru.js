'use strict';
/**
 * Extend default translations
 *
 * Use: Jam.t('Some text')
 * Use: <span data-t="">Some text</span>
 * Use: <div title="Some text" data-t=""></div>
 * Use: <input placeholder="Some text" type="text" data-t="">
 */
Object.assign(Jam.I18n.defaults, {

    'Invite to friends': 'Пригласить в друзья'
});

/**
 * Define custom translation category
 *
 * Use: Jam.t('Some text', 'custom')
 * Use: <span data-t="custom">Some text</span>
 * Use: <div title="Some text" data-t="custom"></div>
 * Use: <input placeholder="Some text" type="text" data-t="custom">
 * Use: <div title="Some text" data-t-title="custom" data-t="">Text</div>
 */
Jam.I18n.custom = {

    'Some text': 'Некоторый текст'
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