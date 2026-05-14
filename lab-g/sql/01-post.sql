create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);

create table locality
(
    id   integer not null
        constraint locality_pk
            primary key autoincrement,
    name text not null,
    municipality text not null,
    county text not null
);